import {swaggerClass, swaggerProperty} from "koa-swagger-decorator";

@swaggerClass()
export default class ServerModel {
    constructor(body) {

        this.id = body.id
        this.name = body.name
        this.domain = body.domain
        this.has_ssl = body.has_ssl
        this.ssl_expired_time = body.ssl_expired_time
        this.up_speed = body.up_speed
        this.down_speed = body.down_speed
        this.port = body.port
        this.https_port = body.https_port
        this.http_port = body.http_port
        this.remark = body.remark
        this.sort = body.sort
        this.creator = body.creator
        this.editor = body.editor
        this.created_time = body.created_time
        this.modified_time = body.modified_time
        this.status = body.status
        this.is_delete = body.is_delete
        this.type = body.type

    }


    @swaggerProperty({ type: "string",description:"",nullable:false}) id
    @swaggerProperty({ type: "string",description:"",nullable:false}) name
    @swaggerProperty({ type: "string",description:"",nullable:false}) domain
    @swaggerProperty({ type: "number",description:"1:yes,0:no",nullable:false}) has_ssl
    @swaggerProperty({ type: "string",description:"",nullable:false}) ssl_expired_time
    @swaggerProperty({ type: "string",description:"",nullable:false}) up_speed
    @swaggerProperty({ type: "string",description:"",nullable:false}) down_speed
    @swaggerProperty({ type: "number",description:"",nullable:true}) sort
    @swaggerProperty({ type: "number",description:"",nullable:true}) port
    @swaggerProperty({ type: "number",description:"",nullable:true}) https_port
    @swaggerProperty({ type: "number",description:"",nullable:true}) http_port
    @swaggerProperty({ type: "string",description:"",nullable:true}) creator
    @swaggerProperty({ type: "string",description:"",nullable:true}) editor
    @swaggerProperty({ type: "string",description:"",nullable:true}) created_time
    @swaggerProperty({ type: "string",description:"",nullable:true}) modified_time
    @swaggerProperty({ type: "number",description:"",nullable:true,default:1}) status
    @swaggerProperty({ type: "number",description:"",nullable:true,default:0}) is_delete
    @swaggerProperty({ type: "string",description:"",nullable:false}) remark
    @swaggerProperty({ type: "number",description:"",nullable:true,default:1}) type

}
