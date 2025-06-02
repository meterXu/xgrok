import {query, request, summary, tags} from "koa-swagger-decorator";
import PaginationModel from "../model/sys/paginationModel";
import OrderByModel from "../model/sys/orderByModel";
import OAuthUsersModel from "../model/oauthUsersModel";
import ResultModel from "../model/sys/resultModel";
import OAuthUsersService from "../service/oauthUsersService";

const tag = tags(['System'])
export default class SysController {
    constructor() {
        if (!this.oAuthUsersService) {
            this.oAuthUsersService = new OAuthUsersService()
        }
    }

    @request('get', '/system/user/query')
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

