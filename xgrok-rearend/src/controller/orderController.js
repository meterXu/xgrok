import {body, query, request, summary, tags} from "koa-swagger-decorator";
import PaginationModel from "../model/sys/paginationModel.js";
import OrderByModel from "../model/sys/orderByModel.js";
import OrderModel from "../model/orderModel.js";

const tag = tags(['Order'])
import OrderService from '../service/orderService.js'
import ResultModel from "../model/sys/resultModel.js";
import ProductService from "../service/productService.js";

export default class OrderController {
    constructor() {
        if (!this.orderService) {
            this.orderService = new OrderService()
        }
        if(!this.productService){
            this.productService = new ProductService()
        }
    }

    @request('get', '/order/query') @summary('查询') @tag @query({...PaginationModel.swaggerDocument, ...OrderByModel.swaggerDocument, ...OrderModel.swaggerDocument})
    async queryOrder(ctx) {
        const pagination = new PaginationModel(ctx.validatedQuery)
        const orderBy = new OrderByModel(ctx.validatedQuery)
        const orderQuery = new OrderModel(ctx.validatedQuery)
        orderQuery.creator = ctx.token.user.id
        const queryRes = await this.orderService.queryOrder(pagination, orderBy, orderQuery)
        const res = new ResultModel({total: queryRes[0], records: queryRes[1], pagination: pagination}, null, true)
        ctx.result(res)
    }

    @request('get', '/order/detail') @summary('查询详情') @tag @query(OrderModel.swaggerDocument)
    async detailOrder(ctx) {
        const orderModel = new OrderModel(ctx.validatedQuery)
        const res = await this.orderService.detailOrder(orderModel)
        ctx.result(new ResultModel(res,null,!!res))
    }

    @request('get', '/order/check') @summary('检查订单支付状态') @tag @query(OrderModel.swaggerDocument)
    async checkOrder(ctx) {
        const orderModel = new OrderModel(ctx.validatedQuery)
        const res = await this.orderService.checkOrder(orderModel.id)
        ctx.result(new ResultModel(res,null,true))
    }

    @request('put', '/order/close') @summary('关闭订单') @tag @body(OrderModel.swaggerDocument)
    async closeOrder(ctx) {
        const orderModel = new OrderModel(ctx.validatedBody)
        const res = await this.orderService.closeOrder(orderModel.id)
        ctx.result(new ResultModel(res,null,true))
    }

    @request('post', '/order') @summary('新增') @tag @body(OrderModel.swaggerDocument)
    async addOrder(ctx) {
        const orderModel = new OrderModel(ctx.validatedBody)
        const addRes = await this.orderService.addOrder(orderModel,ctx.token.user.id)
        const res = new ResultModel(addRes, null, !!addRes)
        ctx.result(res)
    }

    @request('put', '/order') @summary('修改') @tag @body(OrderModel.swaggerDocument)
    async editOrder(ctx) {
        const orderModel = new OrderModel(ctx.validatedBody)
        const editRes = await this.orderService.editOrder(orderModel)
        const res = new ResultModel(editRes.id, null, !!editRes)
        ctx.result(res)
    }

    @request('delete', '/order') @summary('删除') @tag @query({id: {type: "string", required: true, description: 'id'}})
    async delOrder(ctx) {
        let id = ctx.validatedQuery.id;
        const delRes = await this.orderService.delOrder(id)
        const res = new ResultModel(id, null, !!delRes)
        ctx.result(res)
    }

    @request('post','/order/refund') @summary('退款') @tag
    @body({
        out_trade_no: {type: "string", required: true, description: '订单编号'},
        refund_amount: {type: "string", required: true, description: '退款金额'},
        refund_reason: {type: "string", required: true, description: '退款描述'},
        out_request_no: {type: "string", required: true, description: '退款请求号'}
    })
    async refund(ctx){
        let {out_trade_no,refund_amount,refund_reason,out_request_no} = ctx.validatedBody;
        const refundRes = await this.orderService.refund(out_trade_no,refund_amount,refund_reason,out_request_no)
        const res = new ResultModel(null, null, refundRes)
        ctx.result(res)
    }

}