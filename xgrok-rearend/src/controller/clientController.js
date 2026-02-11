import {body, query, request, summary, tags} from "koa-swagger-decorator";
import PaginationModel from "../model/sys/paginationModel.js";
import OrderByModel from "../model/sys/orderByModel.js";
import ClientModel from "../model/clientModel.js";

const tag = tags(['Client'])
import ClientService from '../service/clientService.js'
import ResultModel from "../model/sys/resultModel.js";

export default class ClientController {
    constructor() {
        if (!this.clientService) {
            this.clientService = new ClientService()
        }
    }

    @request('get', '/client/query')
    @summary('根据hostname或device_id查询')
    @tag
    @query({...PaginationModel.swaggerDocument, ...OrderByModel.swaggerDocument, ...ClientModel.swaggerDocument})
    async queryClient(ctx) {
        const pagination = new PaginationModel(ctx.validatedQuery)
        const orderBy = new OrderByModel(ctx.validatedQuery)
        const clientQuery = new ClientModel(ctx.validatedQuery)
        clientQuery.creator = ctx.token.user.id
        const queryRes = await this.clientService.queryClient(pagination, orderBy, clientQuery)
        const res = new ResultModel({total: queryRes[0], records: queryRes[1], pagination: pagination}, null, true)
        ctx.result(res)
    }

    @request('get', '/client/queryList')
    @summary('查询')
    @tag
    @query({...PaginationModel.swaggerDocument, ...OrderByModel.swaggerDocument, ...ClientModel.swaggerDocument})
    async queryClientList(ctx) {
        const pagination = new PaginationModel(ctx.validatedQuery)
        const orderBy = new OrderByModel(ctx.validatedQuery)
        const clientQuery = new ClientModel(ctx.validatedQuery)
        clientQuery.creator = ctx.token.user.id
        const queryRes = await this.clientService.queryClientList(pagination, orderBy, clientQuery)
        const res = new ResultModel({total: queryRes[0], records: queryRes[1], pagination: pagination}, null, true)
        ctx.result(res)
    }

    @request('get', '/client/queryByHostNameOrDeviceId')
    @summary('根据hostname或device_id查询')
    @tag
    @query({
        hostname:{type: "string", description: "", nullable: true},
        device_id:{type: "string", description: "", nullable: true}
    })
    async queryByHostNameOrDeviceId(ctx) {
        const {hostname,device_id} = ctx.validatedQuery
        const client = await this.clientService.queryClientByHostNameOrDeviceId(hostname, device_id,ctx.token.user.id)
        const res = new ResultModel(client, null, true)
        ctx.result(res)
    }

    @request('get', '/client/detail') @summary('查询详情') @tag @query(ClientModel.swaggerDocument)
    async detailClient(ctx) {
        const clientModel = new ClientModel(ctx.validatedQuery)
        const res = await this.clientService.detailClient(clientModel)
        ctx.result(res)
    }

    @request('post', '/client') @summary('新增') @tag @body(ClientModel.swaggerDocument)
    async addClient(ctx) {
        const clientModel = new ClientModel(ctx.validatedBody)
        clientModel.creator = ctx.token.user.id
        const addRes = await this.clientService.addClient(clientModel)
        const res = new ResultModel(addRes.id, null, true)
        ctx.result(res)
    }

    @request('put', '/client') @summary('修改') @tag @body(ClientModel.swaggerDocument)
    async editClient(ctx) {
        const clientModel = new ClientModel(ctx.validatedBody)
        clientModel.editor = ctx.token.user.id
        const editRes = await this.clientService.editClient(clientModel)
        const res = new ResultModel(editRes.id, null, true)
        ctx.result(res)
    }

    @request('delete', '/client') @summary('删除') @tag @query({
        id: {
            type: "string",
            required: true,
            description: 'id'
        }
    })
    async delClient(ctx) {
        let id = ctx.validatedQuery.id;
        const delRes = await this.clientService.delClient(id)
        const res = new ResultModel(id, null, true)
        ctx.result(res)
    }
}
