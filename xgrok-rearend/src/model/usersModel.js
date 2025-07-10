import {swaggerClass, swaggerProperty} from "koa-swagger-decorator";

@swaggerClass()
export default class UsersModel {
    constructor(body) {
        /** generate by CodeGirl */ this.id = body.id
        this.username = body.username
        this.password = body.password
        this.created_time = body.created_time
        this.nickName = body.nickName
        this.creator = body.creator
        this.editor = body.editor
        this.modified_time = body.modified_time
        this.sort = body.sort
        this.status = body.status === undefined ? null : body.status
        this.is_delete = body.is_delete === undefined ? null : body.is_delete
    }

    /** generate by CodeGirl */ @swaggerProperty({type: "string", description: "", nullable: false}) id
    @swaggerProperty({type: "string", description: "", nullable: false}) username
    @swaggerProperty({type: "string", description: "", nullable: false}) password
    @swaggerProperty({type: "string", description: "", nullable: true}) created_time
    @swaggerProperty({type: "string", description: "", nullable: true}) nickName
    @swaggerProperty({type: "string", description: "", nullable: true}) creator
    @swaggerProperty({type: "string", description: "", nullable: true}) editor
    @swaggerProperty({type: "string", description: "", nullable: true}) modified_time
    @swaggerProperty({type: "number", description: "", nullable: true}) sort
    @swaggerProperty({type: "number", description: "", nullable: true}) status
    @swaggerProperty({type: "number", description: "", nullable: true}) is_delete
}
