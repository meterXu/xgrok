import {body, query, request, summary, tags} from "koa-swagger-decorator";
import PaginationModel from "../model/sys/paginationModel.js";
import OrderByModel from "../model/sys/orderByModel.js";
import SysDictModel from "../model/sysDictModel.js";
const tag = tags(['SysDict'])
import SysDictService from '../service/sysDictService.js'
import ResultModel from "../model/sys/resultModel.js";

export default class SysDictController {
    constructor() {
        if(!this.sysDictService){
            this.sysDictService = new SysDictService()
        }
    }

    @request('get', '/sysDict/query')
    @summary('查询系统字典')
    @tag
    @query({...PaginationModel.swaggerDocument,...OrderByModel,...SysDictModel.swaggerDocument})
    async querySysDict(ctx) {
        const res = await this.sysDictService.querySysDict(ctx)
        ctx.result(res)
    }

    @request('get', '/sysDict/detail')
    @summary('查询系统字典详情')
    @tag
    @query({...PaginationModel.swaggerDocument,...OrderByModel,...SysDictModel.swaggerDocument})
    async detailSysDict(ctx) {
        const sysDictModel = new SysDictModel(ctx.request.query)
        const sysDictDetail = await this.sysDictService.detailSysDict(sysDictModel)
        const res = sysDictDetail?new ResultModel(sysDictDetail,null,true):new ResultModel(null,'未找到该数据！',false)
        ctx.result(res)
    }

    @request('post', '/sysDict')
    @summary('新增系统字典')
    @tag
    @body(SysDictModel.swaggerDocument)
    async addSysDict(ctx) {
        const res = await this.sysDictService.addSysDict(ctx)
        ctx.result(res)
    }

    @request('put', '/sysDict')
    @summary('修改系统字典')
    @tag
    @body(SysDictModel.swaggerDocument)
    async editSysDict(ctx) {
        const res = await this.sysDictService.editSysDict(ctx)
        ctx.result(res)
    }


    @request('delete', '/sysDict')
    @summary('删除系统字典')
    @tag
    @query({
        id: {type: "string", required: true, description: 'id'}
    })
    async delSysDict(ctx) {
       const res = await this.sysDictService.delSysDict(ctx)
        ctx.result(res)
    }

}
