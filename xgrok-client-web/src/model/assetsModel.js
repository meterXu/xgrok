import {swaggerClass, swaggerProperty} from "koa-swagger-decorator";

@swaggerClass()
export default class AssetsModel {
    constructor(body) {
        this.id = body.id
        this.name = body.name
    }


    @swaggerProperty({ type: "string",description:"",nullable:false}) id
    @swaggerProperty({ type: "string",description:"",nullable:false}) name

}
