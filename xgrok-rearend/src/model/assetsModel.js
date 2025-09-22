import {swaggerClass, swaggerProperty} from "koa-swagger-decorator";

@swaggerClass()
export default class AssetsModel {
    constructor(body) {
        this.id = body.id
        this.name = body.name
        this.type = body.type
        this.size = body.size
        this.path = body.path
        this.sort = body.sort
        this.creator = body.creator
        this.editor = body.editor
        this.created_time = body.created_time
        this.modified_time = body.modified_time
        this.status = body.status
        this.is_delete = body.is_delete
    }


    @swaggerProperty({ type: "string",description:"",nullable:false}) id
    @swaggerProperty({ type: "string",description:"",nullable:false}) name
    @swaggerProperty({ type: "string",description:"",nullable:false}) type
    @swaggerProperty({ type: "number",description:"",nullable:false}) size
    @swaggerProperty({ type: "string",description:"",nullable:false}) path
    @swaggerProperty({ type: "number",description:"",nullable:true}) sort
    @swaggerProperty({ type: "string",description:"",nullable:true}) creator
    @swaggerProperty({ type: "string",description:"",nullable:true}) editor
    @swaggerProperty({ type: "number",description:"",nullable:true}) created_time
    @swaggerProperty({ type: "number",description:"",nullable:true}) modified_time
    @swaggerProperty({ type: "number",description:"",nullable:true}) status
    @swaggerProperty({ type: "number",description:"",nullable:true}) is_delete

}
