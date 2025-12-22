import SystemService from "../service/systemService.js";
import {body, request, summary, tags} from "koa-swagger-decorator";
import ResultModel from "../model/sys/resultModel.js";
import XgrokConfModel from "../../../xgrok-client/src/models/xgrokConfModel.js";
import LogModel from "../model/logModel.js";

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
        const systemInfo = await this.systemService.getSystemInfo()
        const res = new ResultModel(systemInfo,null,true)
        ctx.result(res)
    }


    @request('put', '/system/turnOn')
    @summary('开启服务')
    @tag
    @body({server:{},tunnelWebs:[],tunnelServices:[]})
    async turnOn(ctx){
        const xgrokConf= new XgrokConfModel(ctx.validatedBody)
        const data = await this.systemService.turnOn(xgrokConf)
        ctx.result(new ResultModel(data.pid,data.message,true))
    }

    @request('put', '/system/turnOff')
    @summary('关闭服务')
    @tag
    @body({pid:''})
    async turnOff(ctx){
        const {pid} = ctx.validatedBody
        ctx.result(new ResultModel(await this.systemService.turnOff(pid),null,true))
    }

    @request('get', '/system/log')
    @summary('获取日志')
    @tag
    async getLog(ctx){
        const logModel = new LogModel(ctx.validatedQuery)
        ctx.result(new ResultModel(await this.systemService.getLog(logModel),null,true))
    }
}
