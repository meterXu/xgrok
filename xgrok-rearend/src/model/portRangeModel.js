import {swaggerClass, swaggerProperty} from "koa-swagger-decorator";

@swaggerClass()
export default class PortRangeModel {
    constructor(body) {

        this.id = body.id

        this.server_id = body.server_id

        this.min_port = body.min_port

        this.max_port = body.max_port

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

    @swaggerProperty({ type: "string",description:"",nullable:false}) server_id

    @swaggerProperty({ type: "number",description:"",nullable:false}) min_port

    @swaggerProperty({ type: "number",description:"",nullable:false}) max_port

    @swaggerProperty({ type: "number",description:"",nullable:true}) sort

    @swaggerProperty({ type: "string",description:"",nullable:true}) creator

    @swaggerProperty({ type: "string",description:"",nullable:true}) editor

    @swaggerProperty({ type: "string",description:"",nullable:true}) created_time

    @swaggerProperty({ type: "string",description:"",nullable:true}) modified_time

    @swaggerProperty({ type: "number",description:"",nullable:true,default:1}) status

    @swaggerProperty({ type: "number",description:"",nullable:true,default:0}) is_delete

    @swaggerProperty({ type: "number",description:"",nullable:true,default:1}) type
}
