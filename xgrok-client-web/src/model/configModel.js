import {swaggerClass, swaggerProperty} from "koa-swagger-decorator";

@swaggerClass()
export default class ConfigModel {
    constructor(body) {
        this.theme = body.theme||'system'
        this.autoServer = body.autoServer
        this.proxy = body.proxy||''
    }

    @swaggerProperty({ type: "string",description:"",nullable:false}) theme
    @swaggerProperty({ type: "boolean",description:"",nullable:true}) autoServer
    @swaggerProperty({ type: "string",description:"",nullable:true}) proxy
}
