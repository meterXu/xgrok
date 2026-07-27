import {swaggerClass, swaggerProperty} from "koa-swagger-decorator";

@swaggerClass()
export default class TunnelWebModel {
    constructor(body) {

        this.id = body.id
        this.server_id = body.server_id
        this.client_id = body.client_id
        this.name = body.name
        this.host = body.host
        this.type = body.type
        this.port = body.port
        this.sort = body.sort
        this.creator = body.creator
        this.editor = body.editor
        this.created_time = body.created_time
        this.modified_time = body.modified_time
        this.status = body.status
        this.is_delete = body.is_delete
        this.is_remote = body.is_remote
        this.is_online = body.is_online??1
        this.is_real = body.is_real??1
        this.remark = body.remark

    }

    @swaggerProperty({ type: "string",description:"",nullable:false}) id
    @swaggerProperty({ type: "string",description:"",nullable:false}) server_id
    @swaggerProperty({ type: "string",description:"",nullable:false}) client_id
    @swaggerProperty({ type: "string",description:"",nullable:true}) name
    @swaggerProperty({ type: "string",description:"",nullable:false}) host
    @swaggerProperty({ type: "number",description:"1:http,2:https",nullable:false}) type
    @swaggerProperty({ type: "number",description:"",nullable:false}) port
    @swaggerProperty({ type: "number",description:"",nullable:true}) sort
    @swaggerProperty({ type: "string",description:"",nullable:true}) creator
    @swaggerProperty({ type: "string",description:"",nullable:true}) editor
    @swaggerProperty({ type: "number",description:"",nullable:true}) created_time
    @swaggerProperty({ type: "number",description:"",nullable:true}) modified_time
    @swaggerProperty({ type: "number",description:"",nullable:true}) status
    @swaggerProperty({ type: "number",description:"",nullable:true}) is_delete
    @swaggerProperty({ type: "number",description:"",nullable:true}) is_remote
    @swaggerProperty({ type: "number",description:"",nullable:true}) is_real
    @swaggerProperty({ type: "number",description:"",nullable:true}) is_online
    @swaggerProperty({ type: "string",description:"",nullable:true}) remark

}
