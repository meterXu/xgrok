import SystemService from "../service/systemService.js";
import {query, request, summary, tags} from "koa-swagger-decorator";
import ResultModel from "../model/sys/resultModel";

const tag = tags(['System'])

export default class SystemController {
    constructor() {
        if(!this.systemService){
            this.systemService = new SystemService()
        }
    }

    @request('get', '/system/info')
    @summary('查询系统信息')
    @tag
    async getSystemInfo(ctx) {
        const systemInfo = this.systemService.getSystemInfo()
        const res = new ResultModel(systemInfo,null,true)
        ctx.result(res)
    }


    @request('put', '/system/turnOn')
    @summary('开启服务')
    @tag
    turnOn(){

    }

    @request('put', '/system/turnOff')
    @summary('关闭服务')
    @tag
    turnOff(){

    }

    @request('get', '/system/log')
    @summary('获取日志')
    @tag
    getLog(){

    }
}
