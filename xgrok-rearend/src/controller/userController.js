import {query, request, summary, tags} from "koa-swagger-decorator";
import ResultModel from "../model/sys/resultModel.js";
import UserService from "../service/userService.js";
import TunnelWebService from "../service/tunnelWebService.js";
import TunnelServiceService from "../service/tunnelServiceService.js";
import EmailService from "../service/emailService.js";
import OrderService from "../service/orderService.js";
import PaginationModel from "../model/sys/paginationModel";
import OrderByModel from "../model/sys/orderByModel";
import OAuthUsersModel from "../model/oauthUsersModel";
import OAuthUsersService from "../service/oauthUsersService";
import {serviceType} from "../utils/enum";
const tag = tags(['User'])

export default class UserController {
    constructor() {
        if(!this.userService)
            this.userService = new UserService()
        if(!this.tunnelWebService)
            this.tunnelWebService = new TunnelWebService
        if(!this.tunnelServiceService)
            this.tunnelServiceService = new TunnelServiceService
        if(!this.emailService)
            this.emailService = new EmailService()
        if(!this.orderService)
            this.orderService = new OrderService()
        if (!this.oAuthUsersService) {
            this.oAuthUsersService = new OAuthUsersService()
        }
    }

    @request('get', '/user/tunnelWebConfig')
    @summary('查询用户web配置')
    @tag
    @query({serverId:{type: "string",description:"服务id",nullable:false}})
    async queryTunnelWebConfig(ctx) {
        let records = await this.userService.queryTunnelWebConfig(ctx.validatedQuery.serverId,ctx.token.user.id,ctx.validatedQuery.clientId)
        const res = new ResultModel(records,null,true)
        ctx.result(res)
    }

    @request('get', '/user/tunnelServiceConfig')
    @summary('查询用户service配置')
    @tag
    @query({serverId:{type: "string",description:"服务id",nullable:false}})
    async queryTunnelServiceConfig(ctx) {
        let records = await this.userService.queryTunnelServiceConfig(ctx.validatedQuery.serverId,ctx.token.user.id,ctx.validatedQuery.clientId)
        const res = new ResultModel(records,null,true)
        ctx.result(res)
    }

    @request('get','/user/checkName')
    @summary('名称占用检查')
    @tag
    @query({
        name:{type:'string',required:true,description:'name'},
        domain:{type:'string',required:true,description:'域名'},
        type: {type: "number", required: true, description: '隧道类型'},
        port:{type:null,required:true,description:'端口'},
        server_id: {type: "string", required: true, description: '服务id'},
        client_id: {type: "string", required: true, description: '客户端id'},
        id: {type: "string", required: true, description: '隧道id'}
    })
    async checkName(ctx){
        const {name,type,domain,port,server_id,client_id,id} = ctx.validatedQuery
        const checkRes = await this.tunnelWebService.checkWeb(name,type,domain,port,server_id,ctx.token.user.id,client_id,id)
        const res = new ResultModel(checkRes,checkRes?'未占用':'该名称已占用，请换一个',true)
        ctx.result(res)
    }

    @request('get', '/user/checkPort')
    @summary('端口占用检查')
    @tag
    @query({
        domain: {type: "string", required: true, description: '域名'},
        port: {type: "number", required: true, description: '端口号'},
        server_id: {type: "string", required: true, description: '服务id'},
        id: {type: "string", required: true, description: '隧道id'},
        type: {type: "number", required: true, description: '服务类型',default:serviceType.tcp},
    })
    async checkPort(ctx){
        const {domain,port,server_id,id,type} = ctx.validatedQuery
        const checkRes = await this.tunnelServiceService.checkPort(domain,port,server_id,ctx.token.user.id,id,type)
        const res = new ResultModel(checkRes,checkRes?'未占用':'远程映射端口已占用，请换一个',true)
        ctx.result(res)
    }

    @request('get', '/user/queryPayPlan')
    @summary('查询付费计划')
    @tag
    async queryPayPlan(ctx){
        const payPlan = await this.orderService.queryPayPlan(ctx.token.user.id)
        const res = new ResultModel(payPlan,'',true)
        ctx.result(res)
    }

    @request('get', '/user/queryTunnelCount')
    @summary('查询隧道列表')
    @tag
    @query({
        server_id: {type: "string", required: true, description: '服务id'},
    })
    async queryTunnelCount(ctx){
        const {server_id} = ctx.validatedQuery
        const res = await this.userService.queryTunnelCount(server_id,ctx.token.user.id)
        ctx.result(res,null,true)
    }

    @request('get', '/user/query')
    @summary('后台管理查询用户列表')
    @tag
    @query({...PaginationModel.swaggerDocument, ...OrderByModel.swaggerDocument, ...OAuthUsersModel.swaggerDocument})
    async userQuery(ctx){
        const pagination = new PaginationModel(ctx.validatedQuery)
        const orderBy = new OrderByModel(ctx.validatedQuery)
        const oAuthUsersQuery = new OAuthUsersModel(ctx.validatedQuery)
        const queryRes = await this.oAuthUsersService.query(pagination, orderBy, oAuthUsersQuery)
        const res = new ResultModel({total: queryRes[0], records: queryRes[1], pagination: pagination}, null, true)
        ctx.result(res)
    }
}
