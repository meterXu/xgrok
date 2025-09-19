import {query, request, summary, tags} from "koa-swagger-decorator";
import VersionService from "../service/versionService";

const tag = tags(['Version'])

export default class VersionController {
    constructor(){
        if(!this.versionService){
            this.versionService = new VersionService()
        }
    }

    @request('get', '/version/latest')
    @summary('查询最新的版本')
    @tag
    async latest(ctx) {
        const res = await this.versionService.latest(ctx)
        ctx.result(res)
    }

    @request('get', '/version/list')
    @summary('查询版本记录')
    @tag
    async list(ctx) {
        const res = await this.versionService.list(ctx)
        ctx.result(res)
    }
}
