import {swaggerClass, swaggerProperty} from "koa-swagger-decorator";
import {isDelete,status} from "../utils/enum.js";

@swaggerClass()
export default class OAuthClientsModel {
    constructor(body) {

        this.id = body.id

        this.client_id = body.client_id

        this.client_secret = body.client_secret

        this.redirect_uri = body.redirect_uri

        this.created_time = body.created_time

        this.status = body.status||status.enable

        this.is_delete = body.is_delete||isDelete.false
    }


    @swaggerProperty({ type: "string",description:"",nullable:false}) id

    @swaggerProperty({ type: "string",description:"",nullable:false}) client_id

    @swaggerProperty({ type: "string",description:"",nullable:false}) client_secret

    @swaggerProperty({ type: "string",description:"",nullable:false}) redirect_uri

    @swaggerProperty({ type: "string",description:"",nullable:true}) created_time

    @swaggerProperty({ type: "number",description:"",nullable:true}) status

    @swaggerProperty({ type: "number",description:"",nullable:true}) is_delete

}
