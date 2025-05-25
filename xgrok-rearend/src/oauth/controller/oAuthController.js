import ResultModel from "../../model/sys/resultModel.js";
import {body, query, request, summary, tags} from "koa-swagger-decorator";
import OAuthService from "../../service/oauthService.js";
import OauthModel from "../../model/query/oauthModel.js";
import EmailModel from "../../model/emailModel.js";
import {randomNumber} from "../../utils/index.js";
import UsersModel from "../../model/usersModel.js";
import EmailService from "../../service/emailService.js";
import OAuthUsersService from "../../service/oauthUsersService.js";
import PaginationModel from "../../model/sys/paginationModel.js";
import OrderByModel from "../../model/sys/orderByModel.js";
import OAuthTokensService from "../../service/oauthTokensService.js";
import {clientIds, roleType} from "../../utils/enum.js";
import Model from "../password/Model.js";
const moment = require('moment');

const tag = tags(['OAuth2.0'])
export default class OAuthController{
    constructor() {
        if(!this.oAuthService)
            this.oAuthService = new OAuthService()
        if(!this.emailService)
            this.emailService = new EmailService()
        if(!this.oAuthUsersService)
            this.oAuthUsersService = new OAuthUsersService()
        if(!this.oAuthTokensService)
            this.oAuthTokensService = new OAuthTokensService()
    }

    @request('post', '/authorize')
    @summary('获取token')
    @body(OauthModel.swaggerDocument)
    @tag
    async getToken(ctx) {
        let compareRes = this.oAuthService.compareSignature(ctx)
        if(!compareRes.success){
            return ctx.result(compareRes)
        }
        let token = await this.oAuthService.getToken(ctx)
        if(token){
            token.client = undefined
            return ctx.result(new ResultModel(token,null,true))
        }else{
            return ctx.result(new ResultModel(null,'该用户没有登录权限！',false,403))
        }
    }

    @request('post', '/refreshToken')
    @summary('刷新token')
    @tag
    @body({refresh_token: { type: 'string', required: true }})
    async refreshToken(ctx) {
        let token = await this.oAuthService.refreshToken(ctx)
        if(token){
            token.client = undefined
            return ctx.result(new ResultModel(token,null,true))
        }else{
            return ctx.result(new ResultModel(null,'refresh_token 无效或已过期！',false,401))
        }
    }

    @request('get', '/sendValidateCode')
    @summary('发送验证码')
    @tag
    @query({email:{type: "string", required: true, description: '邮箱',nullable: false},
                type:{type: "number", required: false, description: '类型',nullable: true}})
    async sendValidateCode(ctx){
        const emailModel = new EmailModel(ctx.validatedQuery)
        const type = ctx.validatedQuery.type
        emailModel.expire_time = {
            gt: new Date(),
        }
        const queryRes = await this.emailService.queryEmail(new PaginationModel({}),new OrderByModel({}),emailModel)
        if(queryRes[1].length>0){// 没过期，则不创建
            emailModel.code = queryRes[1][0].code
        }else {//过期了，则重新创建
            emailModel.code = randomNumber(111111,999999).toString()
            emailModel.expire_time = moment().add(5, 'minutes').toDate()
            await this.emailService.addEmail(emailModel)
        }
        //发送验证码邮件
        await this.emailService.sendEmail(emailModel.email,`${type?'忘记密码':'感谢注册'} xgrok – 电子邮件验证码`,
            `您的验证码为：<span style="font-size: 24px;font-weight: bold">${emailModel.code}</span> <br/><br/><br/><span style="font-style: italic">请注意：该验证码将在5分钟后过期，请尽快验证！</span>`)
        const res = new ResultModel(null, null, true)
        ctx.result(res)
    }

    @request('post', '/validateCode')
    @summary('校验验证码')
    @tag
    @body({email:{type: "string", required: true, description: '邮箱',nullable: false},
               code:{type: "string", required: true, description: '验证码',nullable: false}})
    async validateCode(ctx) {
        const queryRes = await this._validateCode(ctx.validatedBody.email,ctx.validatedBody.code)
        const res = queryRes?new ResultModel(queryRes, null, true)
                                                  :new ResultModel(null, "验证码不正确", false)
        ctx.result(res)
    }

    @request('post', '/register')
    @summary('用户注册')
    @tag
    @body(UsersModel.swaggerDocument)
    async register(ctx){
        const userModel = new UsersModel(ctx.validatedBody)
        if(await this._checkUserIsExist(userModel.username)){
            return ctx.result(new ResultModel('该邮箱已注册',false))
        }
        if(await this._validateCode(userModel.username,ctx.validatedBody.code)){
            const registerRes = await this.oAuthUsersService.register(userModel,ctx.validatedBody.code)
            const accessToken = Model.createNewToken('accessToken')
            const refreshToken = Model.createNewToken('refreshToken')
            const token = await this.oAuthTokensService.createOrUpdateOAuthToken({
                accessToken:accessToken.value,
                accessTokenExpiresAt:accessToken.expiresTime,
                refreshToken:refreshToken.value,
                refreshTokenExpiresAt:refreshToken.expiresTime,
                user:{id:registerRes[0].id},
                client:{id:clientIds.web}
            })
            const data ={
                accessToken:token.access_token,
                user:{
                    id:registerRes[0].id,
                    username:registerRes[0].username,
                    type:roleType.普通用户,
                }
            }
            return ctx.result(new ResultModel(data,null,true))
        }else{
            return ctx.result(new ResultModel('验证码错误或已过期',false))
        }
    }

    @request('get', '/checkUserIsExist')
    @summary('检查用户是否存在')
    @tag
    @query({username:{type: "string", required: true, description: '用户名',nullable: false}})
    async checkUserIsExist(ctx){
        const res = await this._checkUserIsExist(ctx.validatedQuery.username)
        return res?ctx.result(new ResultModel(res.id,'已被占用',false)):ctx.result(new ResultModel(null,'未被占用',true))
    }

    @request('post', '/changePwd')
    @summary('修改密码')
    @tag
    @body(UsersModel.swaggerDocument)
    async changPwd(ctx){
        const userModel = new UsersModel(ctx.validatedBody)
        const code = ctx.validatedBody.code
        if(await this._validateCode(userModel.username,code)){
            await this.oAuthUsersService.changePwd(userModel,code)
            return ctx.result(new ResultModel('',null,true))
        }else{
            return ctx.result(new ResultModel('验证码错误或已过期',false))
        }
    }

    async _checkUserIsExist(username){
        const userQuery = new UsersModel({username:username})
        return await this.oAuthUsersService.queryOAuthUsers(userQuery)
    }

    async _validateCode(email,code){
        const emailQuery = new EmailModel({
            email:email,
            code:code
        })
        return await this.oAuthUsersService.validateCode(emailQuery)
    }
}


