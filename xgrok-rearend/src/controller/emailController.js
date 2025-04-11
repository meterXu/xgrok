import {body, query, request, summary, tags} from "koa-swagger-decorator";
import PaginationModel from "../model/sys/paginationModel.js";
import OrderByModel from "../model/sys/orderByModel.js";
import EmailModel from "../model/emailModel.js";

const tag = tags(['Email'])
import EmailService from '../service/emailService.js'
import ResultModel from "../model/sys/resultModel.js";

export default class EmailController {
    constructor() {
        if (!this.emailService) {
            this.emailService = new EmailService()
        }
    }

    @request('get', '/email/query') @summary('查询') @tag @query({...PaginationModel.swaggerDocument, ...OrderByModel.swaggerDocument, ...EmailModel.swaggerDocument})
    async queryEmail(ctx) {
        const pagination = new PaginationModel(ctx.validatedQuery)
        const orderBy = new OrderByModel(ctx.validatedQuery)
        const emailQuery = new EmailModel(ctx.validatedQuery)
        const queryRes = await this.emailService.queryEmail(pagination, orderBy, emailQuery)
        const res = new ResultModel({total: queryRes[0], records: queryRes[1], pagination: pagination}, null, true)
        ctx.result(res)
    }

    @request('get', '/email/detail') @summary('查询详情') @tag @query(EmailModel.swaggerDocument)
    async detailEmail(ctx) {
        const emailModel = new EmailModel(ctx.validatedQuery)
        const res = await this.emailService.detailEmail(emailModel)
        ctx.result(res)
    }

    @request('post', '/email') @summary('新增') @tag @body(EmailModel.swaggerDocument)
    async addEmail(ctx) {
        const emailModel = new EmailModel(ctx.validatedBody)
        const addRes = await this.emailService.addEmail(emailModel)
        const res = new ResultModel(addRes.id, null, true)
        ctx.result(res)
    }

    @request('put', '/email') @summary('修改') @tag @body(EmailModel.swaggerDocument)
    async editEmail(ctx) {
        const emailModel = new EmailModel(ctx.validatedBody)
        const editRes = await this.emailService.editEmail(emailModel)
        const res = new ResultModel(editRes.id, null, true)
        ctx.result(res)
    }

    @request('delete', '/email') @summary('删除') @tag @query({id: {type: "string", required: true, description: 'id'}})
    async delEmail(ctx) {
        let id = ctx.validatedQuery.id;
        const delRes = await this.emailService.delEmail(id)
        const res = new ResultModel(id, null, true)
        ctx.result(res)
    }
}