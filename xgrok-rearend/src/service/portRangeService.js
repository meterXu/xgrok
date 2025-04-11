import ResultModel from "../model/sys/resultModel.js";
import {randomUUID} from "../utils/index.js";
import {isDelete} from "../utils/enum.js";
import PortRangeModel from "../model/portRangeModel.js";
const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();

export default class PortRangeService {
    constructor() {
    }

    async queryPortRange(pagination,orderBy,portRangeModel) {
        let res = await prisma.$transaction([
            prisma.PortRange.count({
                where: portRangeModel
            }),
            prisma.PortRange.findMany({
                where: portRangeModel,
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

    async detailPortRange(portRangeModel) {
        let res = await prisma.PortRange.findUnique({
            where: {
               id: portRangeModel.id
            }
        })
        return res
    }

    async addPortRange(ctx) {
        const portRangeModel = new PortRangeModel(ctx.request.body)
        let res = await prisma.PortRange.create({
            data: {


              id:portRangeModel.id||randomUUID(),



              server_id:portRangeModel.server_id,



              min_port:portRangeModel.min_port,



              max_port:portRangeModel.max_port,



              sort:portRangeModel.sort,



              creator:portRangeModel.creator,



              editor:portRangeModel.editor,



              created_time:portRangeModel.created_time,



              modified_time:portRangeModel.modified_time,



              status:portRangeModel.status,



              is_delete:portRangeModel.is_delete,


            }
        })
        return new ResultModel(res.id,null,true)
    }

    async editPortRange(ctx) {
        const portRangeModel = new PortRangeModel(ctx.request.body)
        let res = await prisma.PortRange.update({
            where: {
                id: portRangeModel.id
            },
            data: portRangeModel
            });
        return new ResultModel(res.id,null,true)
    }

    async delPortRange(ctx) {
        let id = ctx.request.query.id;
        const res = await prisma.PortRange.update({
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
