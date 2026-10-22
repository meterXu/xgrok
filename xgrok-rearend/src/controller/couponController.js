import {body, query, request, summary, tags} from "koa-swagger-decorator";
import PaginationModel from "../model/sys/paginationModel.js";
import OrderByModel from "../model/sys/orderByModel.js";
import CouponModel from "../model/couponModel.js";
import ResultModel from '../model/sys/resultModel'
import CouponService from '../service/couponService'

const tag = tags(['Coupon'])

export default class OrderController {
    constructor() {
        if (!this.couponService) {
            this.couponService = new CouponService()
        }
    }

    @request('get', '/coupon/query') @summary('查询') @tag @query({...PaginationModel.swaggerDocument, ...OrderByModel.swaggerDocument, ...CouponModel.swaggerDocument})
    async queryCoupon(ctx) {
        const pagination = new PaginationModel(ctx.validatedQuery)
        const orderBy = new OrderByModel(ctx.validatedQuery)
        const couponQuery = new CouponModel(ctx.validatedQuery)
        const queryRes = await this.couponService.queryCoupon(pagination, orderBy, couponQuery)
        const res = new ResultModel({total: queryRes[0], records: queryRes[1], pagination: pagination}, null, true)
        ctx.result(res)
    }

}
