import {swaggerClass, swaggerProperty} from "koa-swagger-decorator";

@swaggerClass() export default class ProductModel {
    constructor(body) {
        /** generate by CodeGirl */
        this.id = body.id
        this.name = body.name
        this.price = body.price
        this.remark = body.remark
        this.sort = body.sort
        this.creator = body.creator
        this.editor = body.editor
        this.created_time = body.created_time
        this.modified_time = body.modified_time
        this.status = body.status === undefined ? 1 : body.status
        this.is_delete = body.is_delete === undefined ? 0 : body.is_delete
    }

    /** generate by CodeGirl */
    @swaggerProperty({type: "string", description: "", nullable: false}) id
    @swaggerProperty({type: "string", description: "", nullable: false}) name
    @swaggerProperty({type: "string", description: "", nullable: false}) price
    @swaggerProperty({type: "string", description: "", nullable: true}) remark
    @swaggerProperty({type: "number", description: "", nullable: true}) sort
    @swaggerProperty({type: "string", description: "", nullable: true}) creator
    @swaggerProperty({type: "string", description: "", nullable: true}) editor
    @swaggerProperty({type: "string", description: "", nullable: true}) created_time
    @swaggerProperty({type: "string", description: "", nullable: true}) modified_time
    @swaggerProperty({type: "number", description: "", nullable: true, default: 1}) status
    @swaggerProperty({type: "number", description: "", nullable: true, default: 0}) is_delete
}