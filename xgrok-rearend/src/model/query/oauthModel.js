import {swaggerClass, swaggerProperty} from "koa-swagger-decorator";

@swaggerClass()
export default class OauthModel{
    constructor(body) {
        this.grant_type = body.grant_type
        this.scope = body.scope
        this.username = body.username
        this.password = body.password
        this.client_id = body.client_id
        this.client_secret = body.client_secret
        this.signature = body.signature
    }
    @swaggerProperty({ type: "string",description:"",nullable:false,required:true}) grant_type
    @swaggerProperty({ type: "string",description:"",nullable:false,required:true}) scope
    @swaggerProperty({ type: "string",description:"",nullable:false,required:true}) username
    @swaggerProperty({ type: "string",description:"",nullable:false,required:true}) password
    @swaggerProperty({ type: "string",description:"",nullable:false,required:true}) client_id
    @swaggerProperty({ type: "string",description:"",nullable:false,required:true}) client_secret
    @swaggerProperty({ type: "string",description:"",nullable:false,required:true}) signature

}
