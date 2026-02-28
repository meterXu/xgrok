import {body, query, request, summary, tags} from "koa-swagger-decorator";
import ResultModel from "../model/sys/resultModel.js";
import UserService from "../service/userService.js";
import TunnelWebService from "../service/tunnelWebService.js";
import TunnelServiceService from "../service/tunnelServiceService.js";
import EmailService from "../service/emailService.js";
import OrderService from "../service/orderService.js";
import PaginationModel from "../model/sys/paginationModel";
import OrderByModel from "../model/sys/orderByModel";
import OAuthUsersService from "../service/oauthUsersService";
import {serviceType} from "../utils/enum";
import UsersModel from "../model/usersModel";
import {checkServerOnline} from "../utils";
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
    @query({
        serverId:{type: "string",required: true,description:"服务器id",nullable:false},
        clientId:{type: "string",required: true, description: '客户端id',nullable:false},
    })
    async queryTunnelWebConfig(ctx) {
        let records = await this.userService.queryTunnelWebConfig(ctx.validatedQuery.serverId,ctx.token.user.id,ctx.validatedQuery.clientId)
        const res = new ResultModel(records,null,true)
        ctx.result(res)
    }

    @request('get', '/user/tunnelServiceConfig')
    @summary('查询用户service配置')
    @tag
    @query({
        serverId:{type: "string",required: true,description:"服务器id",nullable:false},
        clientId:{type: "string",required: true, description: '客户端id',nullable:false},
    })
    async queryTunnelServiceConfig(ctx) {
        let records = await this.userService.queryTunnelServiceConfig(ctx.validatedQuery.serverId,ctx.token.user.id,ctx.validatedQuery.clientId)
        const res = new ResultModel(records,null,true)
        ctx.result(res)
    }

    @request('get', '/user/manage/tunnelWebConfig')
    @summary('后台管理查询用户web配置')
    @tag
    @query({userId:{type: "string",description:"用户id",nullable:false}})
    async queryManageTunnelWebConfig(ctx) {
        const pagination = new PaginationModel(ctx.validatedQuery)
        let queryRes = await this.userService.queryManageTunnelWebConfig(pagination,ctx.validatedQuery.userId)
        const res = new ResultModel({total: queryRes[0], records: queryRes[1], pagination: pagination}, null, true)
        ctx.result(res)
    }

    @request('get', '/user/manage/tunnelServiceConfig')
    @summary('后台管理查询用户service配置')
    @tag
    @query({userId:{type: "string",description:"用户id",nullable:false}})
    async queryManageTunnelServiceConfig(ctx) {
        const pagination = new PaginationModel(ctx.validatedQuery)
        let queryRes = await this.userService.queryManageTunnelServiceConfig(pagination,ctx.validatedQuery.userId)
        const res = new ResultModel({total: queryRes[0], records: queryRes[1], pagination: pagination}, null, true)
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
        server_id: {type: "string", required: true, description: '服务器id'},
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
        server_id: {type: "string", required: true, description: '服务器id'},
        id: {type: "string", required: true, description: '隧道id'},
        type: {type: "number", required: false, description: '服务类型',default:serviceType.tcp},
    })
    async checkPort(ctx){
        const {domain,port,server_id,id,type} = ctx.validatedQuery
        const checkRes = await this.tunnelServiceService.checkPort(domain,port,server_id,ctx.token.user.id,id,type)
        const res = new ResultModel(checkRes,checkRes?'未占用':'远程映射端口已占用，请换一个',true)
        ctx.result(res)
    }

    @request('get','/user/checkService')
    @summary('检查服务地址是否可以访问')
    @tag
    @query({
        domain:{type:'string',required:true,description:'域名'},
        port:{type:'number',required:true,description:'端口'},
        type:{type:'number',required:true,description:'类型'}
    })
    async checkServerOnline(ctx){
        const {domain,port,type} = ctx.validatedQuery
        const checkRes = await  checkServerOnline(domain,port,type)
        const res = new ResultModel(checkRes,checkRes?'服务可访问':'服务不可访问',true)
        ctx.result(res)
    }

    @request('get','/user/checkWeb')
    @summary('检查web地址是否可以访问')
    @tag
    @query({
        name:{type:'string',required:true,description:'name'},
        domain:{type:'string',required:true,description:'域名'},
        port:{type:'number',required:true,description:'端口'}
    })
    async checkWeb(ctx){
        const {name,domain,port} = ctx.validatedQuery
        const checkRes = await this.tunnelWebService.checkUrl(name,domain,port)
        const res = new ResultModel(checkRes,checkRes?'地址可访问':'地址不可访问',true)
        ctx.result(res)
    }

    @request('get', '/user/queryPayPlan')
    @summary('查询捐赠类别')
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
        serverId:{type: "string",required: true,description:"服务器id",nullable:false},
        clientId:{type: "string",required: true, description: '客户端id',nullable:false},
    })
    async queryTunnelCount(ctx){
        const {serverId,clientId} = ctx.validatedQuery
        const res = await this.userService.queryTunnelCount(ctx.token.user.id,serverId,clientId)
        ctx.result(res,null,true)
    }

    @request('get', '/user/query')
    @summary('后台管理查询用户列表')
    @tag
    @query({...PaginationModel.swaggerDocument, ...OrderByModel.swaggerDocument, ...UsersModel.swaggerDocument})
    async userQuery(ctx){
        const pagination = new PaginationModel(ctx.validatedQuery)
        const orderBy = new OrderByModel(ctx.validatedQuery)
        const usersQuery = new UsersModel(ctx.validatedQuery)
        const queryRes = await this.oAuthUsersService.query(pagination, orderBy, usersQuery)
        const res = new ResultModel({total: queryRes[0], records: queryRes[1], pagination: pagination}, null, true)
        ctx.result(res)
    }

    @request('put', '/user')
    @summary('更新用户')
    @tag
    @body(UsersModel.swaggerDocument)
    async editUser(ctx){
        const usersModel = new UsersModel(ctx.validatedBody)
        const res = await this.oAuthUsersService.editUser(usersModel)
        ctx.result(new ResultModel(res.id,null,!!res))
    }

    @request('post', '/user')
    @summary('创建用户')
    @tag
    @body(UsersModel.swaggerDocument)
    async addUser(ctx){
        const usersModel = new UsersModel(ctx.validatedBody)
        const res = await this.oAuthUsersService.createUser(usersModel)
        ctx.result(new ResultModel(res[0].id,null,!!res[0].id))
    }

    @request('get', '/user/detail')
    @summary('用户详情')
    @tag
    @query(UsersModel.swaggerDocument)
    async detailUser(ctx) {
        const usersModel = new UsersModel(ctx.validatedQuery)
        const res = await this.oAuthUsersService.detail(usersModel.id)
        ctx.result(new ResultModel(res,null,!!res))
    }

    @request('delete', '/user')
    @summary('批量删除')
    @tag
    @query({
        id: {type: "string", required: true, description: 'id字符串数组'},
        isPhysics:{type:"boolean",required: false, description: '是否物理删除',default:false},
    })
    async delOrder(ctx) {
        let id = ctx.validatedQuery.id;
        let isPhysics = ctx.validatedQuery.isPhysics;
        const delRes = await this.oAuthUsersService.delUser(id.split(','),isPhysics)
        const res = new ResultModel(id, null, !!delRes)
        ctx.result(res)
    }

    @request('post', '/user/notify')
    @summary('ws发送通知')
    @tag
    @body({
        userId:{type: "string", required: true, description: '用户id'},
        uuid:{type: "string", required: true, description: '唯一id'},
        client_id:{type: "string", required: true, description: '客户端类型'},
        type:{type: "string", required: true, description: '消息类型'},
        context: {type: "string", required: true, description: '通知内容'},
        notifyType:{type: "number", required: true, description: '通知类型'},
    })
    async notify(ctx){
        const {userId,context,type,uuid,client_id,notifyType} = ctx.validatedBody
        const data = Object.assign({
            type,
            userId,
            uuid,
            client_id
        },JSON.parse(context))
        // 向前端发送消息
        global.webSocket.sendToClient(data,notifyType)
        const res = new ResultModel(data, null, true)
        ctx.result(res)
    }

    @request('get', '/user/getRandomSubName')
    @summary('随机获取未被占用的子域名')
    @tag
    @query({
        serverId: {type: "string", required: true, description: '服务器id'}
    })
    async getRandomSubName(ctx){
        const {serverId} = ctx.validatedQuery
        const subName = await this.userService.getRandomSubName(serverId)
        ctx.result(new ResultModel(subName,null,true))
    }
}
