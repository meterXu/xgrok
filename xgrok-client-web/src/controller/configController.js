import {body, request, summary, tags} from "koa-swagger-decorator";
import ResultModel from "../model/sys/resultModel.js";
import ConfigModel from "../model/configModel.js";
import ConfigService from "../service/configService.js";

const tag = tags(['Client'])
export default class ConfigController {
    constructor() {
        if(!this.configService){
            this.configService = new ConfigService()
        }
    }

    @request('get', '/config/appConfig')
    @summary('查询应用配置')
    @tag
    async getAppConfig(ctx){
        let config = await this.configService.getAppConfig()
        ctx.result(new ResultModel(config,'',true))
    }

    @request('put', '/config/appConfig')
    @summary('修改应用配置')
    @tag
    @body(ConfigModel.swaggerDocument)
    async setAppConfig(ctx){
        const configModel = new ConfigModel(ctx.validatedBody)
        const newConfigModel = {}
        Object.entries(configModel).forEach(([key, value]) => {
           if(value!==undefined){
               newConfigModel[key] = value
           }
        })
        await this.configService.setAppConfig(newConfigModel)
        ctx.result(new ResultModel(null,'',true))
    }
}
