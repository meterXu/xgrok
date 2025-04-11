import {body, query, request, summary, tags} from "koa-swagger-decorator";
import PaginationModel from "../model/sys/paginationModel.js";
import OrderByModel from "../model/sys/orderByModel.js";
import ProductModel from "../model/productModel.js";

const tag = tags(['Product'])
import ProductService from '../service/productService.js'
import ResultModel from "../model/sys/resultModel.js";

export default class ProductController {
    constructor() {
        if (!this.productService) {
            this.productService = new ProductService()
        }
    }

    @request('get', '/product/query') @summary('查询') @tag @query({...PaginationModel.swaggerDocument, ...OrderByModel.swaggerDocument, ...ProductModel.swaggerDocument})
    async queryProduct(ctx) {
        const pagination = new PaginationModel(ctx.validatedQuery)
        const orderBy = new OrderByModel(ctx.validatedQuery)
        const productQuery = new ProductModel(ctx.validatedQuery)
        const queryRes = await this.productService.queryProduct(pagination, orderBy, productQuery)
        const res = new ResultModel({total: queryRes[0], records: queryRes[1], pagination: pagination}, null, true)
        ctx.result(res)
    }

    @request('get', '/product/detail') @summary('查询详情') @tag @query(ProductModel.swaggerDocument)
    async detailProduct(ctx) {
        const productModel = new ProductModel(ctx.validatedQuery)
        const res = await this.productService.detailProduct(productModel)
        ctx.result(new ResultModel(res,null,true))
    }

    @request('post', '/product') @summary('新增') @tag @body(ProductModel.swaggerDocument)
    async addProduct(ctx) {
        const productModel = new ProductModel(ctx.validatedBody)
        const addRes = await this.productService.addProduct(productModel)
        const res = new ResultModel(addRes.id, null, true)
        ctx.result(res)
    }

    @request('put', '/product') @summary('修改') @tag @body(ProductModel.swaggerDocument)
    async editProduct(ctx) {
        const productModel = new ProductModel(ctx.validatedBody)
        const editRes = await this.productService.editProduct(productModel)
        const res = new ResultModel(editRes.id, null, true)
        ctx.result(res)
    }

    @request('delete', '/product') @summary('删除') @tag @query({
        id: {
            type: "string",
            required: true,
            description: 'id'
        }
    })
    async delProduct(ctx) {
        let id = ctx.validatedQuery.id;
        const delRes = await this.productService.delProduct(id)
        const res = new ResultModel(id, null, true)
        ctx.result(res)
    }
}