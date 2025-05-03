import {body, query, request, summary, tags} from "koa-swagger-decorator";
import PaginationModel from "../model/sys/paginationModel.js";
import ServerModel from "../model/serverModel.js";
const tag = tags(['Server'])
import ServerService from '../service/serverService.js'
import ResultModel from "../model/sys/resultModel.js";
import OrderByModel from "../model/sys/orderByModel.js";
import {isOnline} from "../utils/enum";

export default class ServerController {
    constructor() {
        if(!this.serverService){
            this.serverService = new ServerService()
        }
    }

    @request('get', '/server/query')
    @summary('查询服务器')
    @tag
    @query({...PaginationModel.swaggerDocument,...OrderByModel.swaggerDocument,...ServerModel.swaggerDocument})
    async queryServer(ctx) {
        const pagination = new PaginationModel(ctx.validatedQuery)
        const orderBy = new OrderByModel(ctx.validatedQuery)
        const serverQuery = new ServerModel(ctx.validatedQuery)
        const queryRes = await this.serverService.queryServer(pagination,orderBy,serverQuery)
        const res = new ResultModel({
            total: queryRes[0],
            records: queryRes[1],
            pagination: pagination
        },null,true)
        ctx.result(res)
    }

    @request('get', '/server/detail')
    @summary('查询服务器详情')
    @tag
    @query({...ServerModel.swaggerDocument})
    async detailServer(ctx) {
        const serverQuery = new ServerModel(ctx.validatedQuery)
        const serverDetail = await this.serverService.detailServer(serverQuery)
        const res = serverDetail?new ResultModel(serverDetail,null,true):new ResultModel(null,'未找到该数据！',false)
        ctx.result(res)
    }

    @request('post', '/server')
    @summary('新增服务器')
    @tag
    @body(ServerModel.swaggerDocument)
    async addServer(ctx) {
        const res = await this.serverService.addServer(ctx)
        ctx.result(res)
    }

    @request('put', '/server')
    @summary('修改服务器')
    @tag
    @body(ServerModel.swaggerDocument)
    async editServer(ctx) {
        const res = await this.serverService.editServer(ctx)
        ctx.result(res)
    }


    @request('delete', '/server')
    @summary('删除服务器')
    @tag
    @query({
        id: {type: "string", required: true, description: 'id'}
    })
    async delServer(ctx) {
       const res = await this.serverService.delServer(ctx)
        ctx.result(res)
    }

    @request('get', '/server/checkServerOnline')
    @summary('检查域名端口监听情况')
    @tag
    @query({
        domain: {type: "string", required: true, description: 'domain'},
        port: {type: "number", required: true, description: 'port'}
    })
    async checkServerOnline(ctx){
        const {domain,port} = ctx.validatedQuery
        const checkRes =  await this.serverService.queryServer(new PaginationModel({pageSize:1,pageNumber:1}),new OrderByModel({}),{
            domain:domain,
            port:port
        })
        let is_online = false
        if(checkRes[0]>=1){
            is_online = checkRes[1][0]['is_online']===isOnline.online
        }
        ctx.result(new ResultModel(is_online,null,true))
    }

}
