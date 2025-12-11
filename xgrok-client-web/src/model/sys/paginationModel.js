import {swaggerClass, swaggerProperty} from "koa-swagger-decorator";

@swaggerClass()
export default class PaginationModel {
    constructor(query) {
        this.pageNumber = parseInt(query.pageNumber)||1
        this.pageSize = parseInt(query.pageSize)||1
    }
    @swaggerProperty({ type: "number",description:"页数",nullable:false,default:1}) pageNumber=1 //设置默认值
    @swaggerProperty({ type: "number",description:"每页条数",nullable:false,default:11}) pageSize=10 // default描述默认值，=设置默认值
}