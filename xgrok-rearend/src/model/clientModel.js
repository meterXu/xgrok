import {swaggerClass, swaggerProperty} from "koa-swagger-decorator";

@swaggerClass() export default class ClientModel {
    constructor(body) {
        /** generate by CodeGirl */
        this.id = body.id
        this.hostname = body.hostname
        this.osVersion = body.osVersion
        this.device_id = body.device_id
        this.sort = body.sort
        this.is_vip = body.is_vip
        this.creator = body.creator
        this.editor = body.editor
        this.created_time = body.created_time
        this.modified_time = body.modified_time
        this.status = body.status
        this.is_delete = body.is_delete
    }

    /** generate by CodeGirl */
    @swaggerProperty({type: "string", description: "", nullable: false}) id
    @swaggerProperty({type: "string", description: "", nullable: true}) hostname
    @swaggerProperty({type: "string", description: "", nullable: true}) osVersion
    @swaggerProperty({type: "string", description: "", nullable: true}) device_id
    @swaggerProperty({type: "number", description: "", nullable: true}) sort
    @swaggerProperty({type: "number", description: "", nullable: false}) is_vip
    @swaggerProperty({type: "string", description: "", nullable: true}) creator
    @swaggerProperty({type: "string", description: "", nullable: true}) editor
    @swaggerProperty({type: "number", description: "", nullable: true}) created_time
    @swaggerProperty({type: "number", description: "", nullable: true}) modified_time
    @swaggerProperty({type: "number", description: "", nullable: true, default: 1}) status
    @swaggerProperty({type: "number", description: "", nullable: true, default: 0}) is_delete
}
