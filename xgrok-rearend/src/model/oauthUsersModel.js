import {swaggerClass, swaggerProperty} from "koa-swagger-decorator";
import {isDelete, status} from "../utils/enum.js";
@swaggerClass()
export default class OAuthUsersModel {
    constructor(body) {

        this.id = body.id

        this.username = body.username

        this.password = body.password

        this.created_time = body.created_time

        this.status = body.status

        this.is_delete = body.is_delete

    }


    @swaggerProperty({ type: "string",description:"",nullable:false}) id

    @swaggerProperty({ type: "string",description:"",nullable:false}) username

    @swaggerProperty({ type: "string",description:"",nullable:false}) password

    @swaggerProperty({ type: "number",description:"",nullable:true}) created_time

    @swaggerProperty({ type: "number",description:"",nullable:true}) status

    @swaggerProperty({ type: "number",description:"",nullable:true}) is_delete

    // 查询条件
    @swaggerProperty({type: "number", description: "", nullable: true}) created_time_start
    @swaggerProperty({type: "number", description: "", nullable: true}) created_time_end
    @swaggerProperty({type: "string", description: "", nullable: true}) role_id

}
