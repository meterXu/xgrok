import {swaggerClass, swaggerProperty} from "koa-swagger-decorator";

@swaggerClass()
export default class CouponOrderModel {
    constructor(body) {
        /** generate by CodeGirl */
        this.id = body.id
        this.creator = body.creator
        this.editor = body.editor
        this.created_time = body.created_time
        this.modified_time = body.modified_time
        this.status = body.status
        this.is_delete = body.is_delete
        this.coupon_id = body.coupon_id
        this.order_id = body.order_id
    }

    /** generate by CodeGirl */
    @swaggerProperty({type: "string", description: "", nullable: true}) id
    // 查询条件
    @swaggerProperty({type: "number", description: "", nullable: true}) coupon_id
    @swaggerProperty({type: "number", description: "", nullable: true}) order_id
    // 查询条件
    @swaggerProperty({type: "string", description: "", nullable: true}) creator
    @swaggerProperty({type: "string", description: "", nullable: true}) editor
    @swaggerProperty({type: "number", description: "", nullable: true}) created_time
    @swaggerProperty({type: "number", description: "", nullable: true}) modified_time
    @swaggerProperty({type: "number", description: "", nullable: true, default: 1}) status
    @swaggerProperty({type: "number", description: "", nullable: true, default: 0}) is_delete
}
