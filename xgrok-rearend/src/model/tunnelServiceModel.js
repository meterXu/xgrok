import {swaggerClass, swaggerProperty} from "koa-swagger-decorator";

@swaggerClass()
export default class TunnelServiceModel {
    constructor(body) {
        
        this.id = body.id
        this.server_id = body.server_id
        this.client_id = body.client_id
        this.name = body.name
        this.host = body.host
        this.type = body.type
        this.port = body.port
        this.remote_port = body.remote_port
        this.sort = body.sort
        this.creator = body.creator
        this.editor = body.editor
        this.created_time = body.created_time
        this.modified_time = body.modified_time
        this.status = body.status
        this.is_delete = body.is_delete
        this.is_remote = body.is_remote
        this.remark = body.remark
        
    }

    
    @swaggerProperty({ type: "string",description:"",nullable:false}) id
    @swaggerProperty({ type: "string",description:"",nullable:false}) server_id
    @swaggerProperty({ type: "string",description:"",nullable:false}) client_id
    @swaggerProperty({ type: "string",description:"",nullable:false}) name
    @swaggerProperty({ type: "string",description:"",nullable:false}) host
    @swaggerProperty({ type: "number",description:"1:tcp,2:udp",nullable:false}) type
    @swaggerProperty({ type: "number",description:"",nullable:false}) port
    @swaggerProperty({ type: "number",description:"",nullable:false}) remote_port
    @swaggerProperty({ type: "number",description:"",nullable:true}) sort
    @swaggerProperty({ type: "string",description:"",nullable:true}) creator
    @swaggerProperty({ type: "string",description:"",nullable:true}) editor
    @swaggerProperty({ type: "string",description:"",nullable:true}) created_time
    @swaggerProperty({ type: "string",description:"",nullable:true}) modified_time
    @swaggerProperty({ type: "number",description:"",nullable:true,default:1}) status
    @swaggerProperty({ type: "number",description:"",nullable:true,default:0}) is_delete
    @swaggerProperty({ type: "number",description:"",nullable:true,default:0}) is_remote
    @swaggerProperty({ type: "string",description:"",nullable:true}) remark
    
}