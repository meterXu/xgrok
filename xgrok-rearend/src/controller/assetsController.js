import AssetsService from "../service/assetsService";
import {query, request, summary, tags} from "koa-swagger-decorator";
import PaginationModel from "../model/sys/paginationModel";
import OrderByModel from "../model/sys/orderByModel";
import AssetsModel from "../model/assetsModel";
import ResultModel from "../model/sys/resultModel";

const tag = tags(['Assets'])

export default class AssetsController {
    constructor() {
        if(!this.assetsService){
            this.assetsService = new AssetsService()
        }
    }

    @request('get', '/assets/query')
    @summary('查询资源')
    @tag
    @query({...PaginationModel.swaggerDocument,...OrderByModel.swaggerDocument,...AssetsModel.swaggerDocument})
    async queryAssets(ctx) {
        const pagination = new PaginationModel(ctx.validatedQuery)
        const orderBy = new OrderByModel(ctx.validatedQuery)
        const assetsQuery = new AssetsModel(ctx.validatedQuery)
        assetsQuery.name = {
            contains:assetsQuery.name
        }
        const queryRes = await this.assetsService.queryAssets(pagination,orderBy,assetsQuery)
        const res = new ResultModel({
            total: queryRes[0],
            records: queryRes[1],
            pagination: pagination
        },null,true)
        ctx.result(res)
    }

    @request('get', '/assets/detail')
    @summary('查询资源详情')
    @tag
    @query({...AssetsModel.swaggerDocument})
    async detailAssets(ctx){
        const assetsQuery = new AssetsModel(ctx.validatedQuery)
        const assetsDetail = await this.assetsService.detailAssets(assetsQuery)
        const res = assetsDetail?new ResultModel(assetsDetail,null,true):new ResultModel(null,'未找到该数据！',false)
        ctx.result(res)
    }
}