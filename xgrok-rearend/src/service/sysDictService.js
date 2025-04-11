import PaginationModel from "../model/sys/paginationModel.js";
import OrderByModel from "../model/sys/orderByModel.js";
import ResultModel from "../model/sys/resultModel.js";
import {randomUUID} from "../utils/index.js";
import {isDelete,status} from "../utils/enum.js";
import SysDictModel from "../model/sysDictModel.js";
const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();

export default class SysDictService {
    constructor() {
    }

    async querySysDict(ctx) {
        const pagination = new PaginationModel(ctx.request.query)
        const order = new OrderByModel(ctx.request.query)
        const sysDictModel = new SysDictModel(ctx.request.query)
        const orderBy = {'created_time':'desc'}
        let res = await prisma.$transaction([
            prisma.SysDict.count({
                where: sysDictModel
            }),
            prisma.SysDict.findMany({
                where: sysDictModel,
                orderBy: orderBy,
                skip: (pagination.pageNumber - 1) * pagination.pageSize,
                take: pagination.pageSize
            }),
        ])

        return new ResultModel({
            total: res[0],
            records: res[1],
            pagination: pagination
        },null,true)
    }

    async detailSysDict(sysDictModel) {
        let res = await prisma.SysDict.findUnique({
            where: {
               id: sysDictModel.id
            }
        })
        return res
    }

    async addSysDict(ctx) {
        const sysDictModel = new SysDictModel(ctx.request.body)
        let res = await prisma.SysDict.create({
            data: {


              id:sysDictModel.id||randomUUID(),



              key:sysDictModel.key,



              code:sysDictModel.code,



              chn_value:sysDictModel.chn_value,



              eng_value:sysDictModel.eng_value,



              sort:sysDictModel.sort,



              creator:sysDictModel.creator,



              editor:sysDictModel.editor,



              created_time:sysDictModel.created_time,



              modified_time:sysDictModel.modified_time,



              status:sysDictModel.status,



              is_delete:sysDictModel.is_delete,


            }
        })
        return new ResultModel(res.id,null,true)
    }

    async editSysDict(ctx) {
        const sysDictModel = new SysDictModel(ctx.request.body)
        let res = await prisma.SysDict.update({
            where: {
                id: sysDictModel.id
            },
            data: sysDictModel
            });
        return new ResultModel(res.id,null,true)
    }

    async delSysDict(ctx) {
        let id = ctx.request.query.id;
        const res = await prisma.SysDict.update({
              data:{
                  is_delete: isDelete.true,
              },
              where: {
                  id: id
              }
        })
        return new ResultModel(id,null,true)
    }

}
