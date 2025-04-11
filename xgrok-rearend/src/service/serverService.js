import ResultModel from "../model/sys/resultModel.js";
import {randomUUID} from "../utils/index.js";
import {isDelete,status} from "../utils/enum.js";
import ServerModel from "../model/serverModel.js";
const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();

export default class ServerService {
    constructor() {
    }

    async queryServer(pagination,orderBy,serverQuery) {

        return await prisma.$transaction([
            prisma.Server.count({
                where: serverQuery
            }),
            prisma.Server.findMany({
                where: serverQuery,
                orderBy: orderBy,
                skip: (pagination.pageNumber - 1) * pagination.pageSize,
                take: pagination.pageSize
            }),
        ])
    }

    async detailServer(serverModel) {
        return await prisma.Server.findUnique({
            where: {
               id: serverModel.id
            }
        })
    }

    async addServer(ctx) {
        const serverModel = new ServerModel(ctx.request.body)
        let res = await prisma.Server.create({
            data: {
              id:serverModel.id||randomUUID(),
              name:serverModel.name,
              domain:serverModel.domain,
              port:serverModel.port,
              http_port:serverModel.http_port,
              https_port:serverModel.https_port,
              has_ssl:serverModel.has_ssl,
              ssl_expired_time:serverModel.ssl_expired_time,
              up_speed:serverModel.up_speed,
              down_speed:serverModel.down_speed,
              sort:serverModel.sort,
              creator:serverModel.creator,
              editor:serverModel.editor,
              created_time:serverModel.created_time,
              modified_time:serverModel.modified_time,
              status:serverModel.status,
              is_delete:serverModel.is_delete,
              remark:serverModel.remark,
            }
        })
        return new ResultModel(res.id,null,true)
    }

    async editServer(ctx) {
        const serverModel = new ServerModel(ctx.request.body)
        let res = await prisma.Server.update({
            where: {
                id: serverModel.id
            },
            data: serverModel
            });
        return new ResultModel(res.id,null,true)
    }

    async delServer(ctx) {
        let id = ctx.request.query.id;
        const res = await prisma.Server.update({
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
