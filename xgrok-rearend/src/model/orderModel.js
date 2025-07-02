import {swaggerClass, swaggerProperty} from "koa-swagger-decorator";

@swaggerClass()
export default class OrderModel {
    constructor(body) {
        /** generate by CodeGirl */
        this.id = body.id
        this.trade_no = body.trade_no
        this.product_id = body.product_id
        this.remark = body.remark
        this.pay_price = body.pay_price
        this.pay_num = body.pay_num === undefined ? 1 : body.pay_num
        this.pay_total_amount = body.pay_total_amount
        this.payed_time = body.payed_time
        this.pay_time_start = body.pay_time_start
        this.pay_time_end = body.pay_time_end
        this.refund_time = body.refund_time
        this.pay_status = body.pay_status === undefined ? 0 : body.pay_status
        this.alipay_qrCode = body.alipay_qrCode
        this.alipay_traceId = body.alipay_traceId
        this.sort = body.sort
        this.creator = body.creator
        this.username = body.username
        this.editor = body.editor
        this.created_time = body.created_time
        this.modified_time = body.modified_time
        this.status = body.status === undefined ? 1 : body.status
        this.is_delete = body.is_delete === undefined ? 0 : body.is_delete
        this.created_time_start = body.created_time_start
        this.created_time_end = body.created_time_end
    }

    /** generate by CodeGirl */
    @swaggerProperty({type: "string", description: "", nullable: false}) id
    @swaggerProperty({type: "string", description: "", nullable: false}) trade_no
    @swaggerProperty({type: "string", description: "", nullable: false}) product_id
    @swaggerProperty({type: "string", description: "", nullable: false}) remark
    @swaggerProperty({type: "string", description: "", nullable: true}) pay_total_amount
    @swaggerProperty({type: "string", description: "", nullable: false}) pay_price
    @swaggerProperty({type: "string", description: "", nullable: true}) payed_time
    @swaggerProperty({type: "number", description: "", nullable: false, default: 1}) pay_num
    // 查询条件
    @swaggerProperty({type: "string", description: "", nullable: true}) pay_time_start
    @swaggerProperty({type: "string", description: "", nullable: true}) pay_time_end
    @swaggerProperty({type: "string", description: "", nullable: true}) username
    @swaggerProperty({type: "string", description: "", nullable: true}) created_time_start
    @swaggerProperty({type: "string", description: "", nullable: true}) created_time_end
    // 查询条件
    @swaggerProperty({type: "string", description: "", nullable: true}) refund_time
    @swaggerProperty({type: "number", description: "", nullable: true, default: 0}) pay_status
    @swaggerProperty({type: "string", description: "", nullable: true}) alipay_qrCode
    @swaggerProperty({type: "string", description: "", nullable: true}) alipay_traceId
    @swaggerProperty({type: "number", description: "", nullable: true}) sort
    @swaggerProperty({type: "string", description: "", nullable: true}) creator
    @swaggerProperty({type: "string", description: "", nullable: true}) editor
    @swaggerProperty({type: "string", description: "", nullable: true}) created_time
    @swaggerProperty({type: "string", description: "", nullable: true}) modified_time
    @swaggerProperty({type: "number", description: "", nullable: true, default: 1}) status
    @swaggerProperty({type: "number", description: "", nullable: true, default: 0}) is_delete
}