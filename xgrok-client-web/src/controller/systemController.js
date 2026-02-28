import SystemService from "../service/systemService.js";
import {body, query, request, summary, tags} from "koa-swagger-decorator";
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
    @body({
        server:{required:true,description:'服务信息'},
        tunnelWebs:{required:true,description:'web隧道信息'},
        tunnelServices:{required:true,description:'服务隧道信息'}})
    async turnOn(ctx){
        const xgrokConf= new XgrokConfModel(ctx.validatedBody)
        const data = await this.systemService.turnOn(xgrokConf)
        ctx.result(new ResultModel(data.pid,data.message,true))
    }

    @request('put', '/system/turnOff')
    @summary('关闭服务')
    @tag
    @body({pid:{type:'number',required:true,description:'进程id'}})
    async turnOff(ctx){
        const {pid} = ctx.validatedBody
        ctx.result(new ResultModel(await this.systemService.turnOff(pid),null,true))
    }

    @request('get', '/system/log')
    @summary('获取日志')
    @tag
    @query(LogModel.swaggerDocument)
    async getLog(ctx){
        const logModel = new LogModel(ctx.validatedQuery)
        ctx.result(new ResultModel(await this.systemService.getLog(logModel),null,true))
    }

    @request('get', '/system/checkWeb')
    @summary('检测web在线状态')
    @tag
    @query({
        name:{type:'string',required:true,description:'name'},
        domain:{type:'string',required:true,description:'域名'},
        port:{type:'number',required:true,description:'端口'}
    })
    async checkWeb(ctx){
        const {name, domain, port} = ctx.validatedQuery
        const res = await this.systemService.checkWeb(name, domain, port)
        ctx.result(new ResultModel(res.data,res.message,true))
    }

    @request('get', '/system/checkService')
    @summary('检测service在线状态')
    @tag
    @query({
        domain:{type:'string',required:true,description:'域名'},
        port:{type:'number',required:true,description:'端口'},
        type:{type:'number',required:true,description:'类型'}
    })
    async checkService(ctx){
        const {domain, port, type} = ctx.validatedQuery
        const res = await this.systemService.checkService(domain, port, type)
        ctx.result(new ResultModel(res.data,res.message,true))
    }
}
