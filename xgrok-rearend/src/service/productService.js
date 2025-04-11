import {randomUUID} from "../utils/index.js";
import {isDelete, status} from "../utils/enum.js";

const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();
export default class ProductService {
    constructor() {
    }

    async queryProduct(pagination, orderBy, productModel) {
        return await prisma.$transaction([prisma.ng_product.count({where: productModel}), prisma.ng_product.findMany({
            where: productModel,
            orderBy: orderBy,
            skip: (pagination.pageNumber - 1) * pagination.pageSize,
            take: pagination.pageSize
        })])
    }

    async detailProduct(productModel) {
        return await prisma.ng_product.findUnique({where: {id: productModel.id}})
    }

    async addProduct(productModel) {
        let res = await prisma.ng_product.create({
            data: {
                /** generate by CodeGirl */
                id: productModel.id || randomUUID(),
                name: productModel.name,
                price: productModel.price,
                remark: productModel.remark,
                sort: productModel.sort,
                creator: productModel.creator,
                editor: productModel.editor,
                created_time: productModel.created_time,
                modified_time: productModel.modified_time,
                status: productModel.status,
                is_delete: productModel.is_delete,
            }
        })
        return res
    }

    async editProduct(productModel) {
        let res = await prisma.ng_product.update({where: {id: productModel.id}, data: productModel});
        return res
    }

    async delProduct(id) {
        const res = await prisma.ng_product.update({data: {is_delete: isDelete.true,}, where: {id: id}})
        return res
    }
}