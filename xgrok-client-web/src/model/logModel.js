import {swaggerClass, swaggerProperty} from "koa-swagger-decorator";

@swaggerClass()
export default class LogModel {
    constructor(body) {
        this.startIndex = body.startIndex
        this.length = body.length
    }

    @swaggerProperty({ type: "number",description:"",nullable:false}) startIndex
    @swaggerProperty({ type: "number",description:"",nullable:true}) length
}
