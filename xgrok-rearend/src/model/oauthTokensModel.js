import {swaggerClass, swaggerProperty} from "koa-swagger-decorator";

@swaggerClass()
export default class OAuthTokensModel {
    constructor(body) {

        this.id = body.id

        this.access_token = body.access_token

        this.access_token_expires_at = body.access_token_expires_at

        this.client_id = body.client_id

        this.refresh_token = body.refresh_token

        this.refresh_token_expires_at = body.refresh_token_expires_at

        this.user_id = body.user_id

        this.created_time = body.created_time

    }


    @swaggerProperty({ type: "string",description:"",nullable:false}) id

    @swaggerProperty({ type: "string",description:"",nullable:false}) access_token

    @swaggerProperty({ type: "string",description:"",nullable:false}) access_token_expires_at

    @swaggerProperty({ type: "string",description:"",nullable:false}) client_id

    @swaggerProperty({ type: "string",description:"",nullable:false}) refresh_token

    @swaggerProperty({ type: "string",description:"",nullable:false}) refresh_token_expires_at

    @swaggerProperty({ type: "string",description:"",nullable:false}) user_id

    @swaggerProperty({ type: "string",description:"",nullable:true}) created_time

}
