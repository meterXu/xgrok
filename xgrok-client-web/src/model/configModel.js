import {swaggerClass, swaggerProperty} from "koa-swagger-decorator";

@swaggerClass()
export default class ConfigModel {
    constructor(body) {
        this.theme = body.theme||'system'
        this.pid = body.pid
        this.device_id = body.device_id
        this.autoServer = body.autoServer
        this.selected_server_id = body.selected_server_id
    }

    @swaggerProperty({ type: "string",description:"",nullable:false}) theme
    @swaggerProperty({ type: "number",description:"",nullable:true}) pid
    @swaggerProperty({ type: "string",description:"",nullable:true}) device_id
    @swaggerProperty({ type: "boolean",description:"",nullable:true}) autoServer
    @swaggerProperty({ type: "string",description:"",nullable:true}) selected_server_id
}
