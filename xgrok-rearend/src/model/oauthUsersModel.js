import {swaggerClass, swaggerProperty} from "koa-swagger-decorator";
import {isDelete, status} from "../utils/enum.js";
@swaggerClass()
export default class OAuthUsersModel {
    constructor(body) {

        this.id = body.id

        this.username = body.username

        this.password = body.password

        this.created_time = body.created_time

        this.status = body.status||status.enable

        this.is_delete = body.is_delete||isDelete.false

    }


    @swaggerProperty({ type: "string",description:"",nullable:false}) id

    @swaggerProperty({ type: "string",description:"",nullable:false}) username

    @swaggerProperty({ type: "string",description:"",nullable:false}) password

    @swaggerProperty({ type: "string",description:"",nullable:true}) created_time

    @swaggerProperty({ type: "number",description:"",nullable:true}) status

    @swaggerProperty({ type: "number",description:"",nullable:true}) is_delete

}
