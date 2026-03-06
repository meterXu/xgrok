import ResultModel from "../model/sys/resultModel.js";
import {modelToWhere, randomUUID} from "../utils/index.js";
import {isDelete} from "../utils/enum.js";
import ServerModel from "../model/serverModel.js";
import {Prisma} from "@prisma/client";
import {query} from "koa-swagger-decorator";

const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();

export default class ServerService {
    constructor() {
    }

    async queryServer(pagination, orderBy, serverQuery, creatorId,clientId) {
        const where = modelToWhere(serverQuery, 'a.')
        const query = `select a.*,
                              b.web_tunnel_count,
                              c.service_tunnel_count,
                              d.user_web_tunnel_count,
                              e.user_service_tunnel_count
                       from ng_server a
                                left join (select a.id,
                                                  count(b.id) web_tunnel_count
                                           from ng_server a
                                                    left join ng_tunnel_web b on a.id = b.server_id and b.is_delete = 0 and b.status = 1
                                           group by a.id) b on a.id = b.id
                                left join (select a.id,
                                                  count(b.id) service_tunnel_count
                                           from ng_server a
                                                    left join ng_tunnel_service b
                                                              on a.id = b.server_id and b.is_delete = 0 and b.status = 1

                                           group by a.id) c on a.id = c.id
                                left join (select a.id,
                                                  count(b.id) user_web_tunnel_count
                                           from ng_server a
                                                    left join ng_tunnel_web b
                                                              on a.id = b.server_id and b.is_delete = 0 and
                                                                 b.status = 1 and
                                                                 b.creator = '${creatorId}' and
                                                                 b.client_id = '${clientId}'
                                           group by a.id) d on a.id = d.id
                                left join (select a.id,
                                                  count(b.id) user_service_tunnel_count
                                           from ng_server a
                                                    left join ng_tunnel_service b
                                                              on a.id = b.server_id and b.is_delete = 0 and
                                                                 b.status = 1 and
                                                                 b.creator = '${creatorId}' and
                                                                 b.client_id = '${clientId}'
                                           group by a.id) e on a.id = e.id
                           ${where ? `where ${where}` : ''}
                       order by a.sort asc,a.created_time desc
                           limit ${(pagination.pageNumber - 1) * pagination.pageSize}, ${pagination.pageSize}`
        return await prisma.$transaction([
            prisma.Server.count({
                where: serverQuery
            }),
            prisma.$queryRaw(Prisma.raw(query)),
        ])
    }

    async detailServer(serverModel,creatorId,clientId) {
        let query = await prisma.$queryRaw(Prisma.raw(`select a.*,
                                             b.web_tunnel_count,
                                             c.service_tunnel_count,
                                             d.user_web_tunnel_count,
                                             e.user_service_tunnel_count
                                      from ng_server a
                                               left join (select a.id,
                                                                 count(b.id) web_tunnel_count
                                                          from ng_server a
                                                                   left join ng_tunnel_web b on a.id = b.server_id and b.is_delete = 0 and b.status = 1
                                                          group by a.id) b on a.id = b.id
                                               left join (select a.id,
                                                                 count(b.id) service_tunnel_count
                                                          from ng_server a
                                                                   left join ng_tunnel_service b
                                                                             on a.id = b.server_id and b.is_delete = 0 and b.status = 1
                                                          group by a.id) c on a.id = c.id
                                               left join (select a.id,
                                                                 count(b.id) user_web_tunnel_count
                                                          from ng_server a
                                                                   left join ng_tunnel_web b
                                                                             on a.id = b.server_id and
                                                                                b.is_delete = 0 and b.status = 1 and
                                                                                b.creator = '${creatorId}' and
                                                                                b.client_id = '${clientId}'
                                                          group by a.id) d on a.id = d.id
                                               left join (select a.id,
                                                                 count(b.id) user_service_tunnel_count
                                                          from ng_server a
                                                                   left join ng_tunnel_service b
                                                                             on a.id = b.server_id and
                                                                                b.is_delete = 0 and b.status = 1 and
                                                                                b.creator = '${creatorId}' and
                                                                                b.client_id = '${clientId}'
                                                          group by a.id) e on a.id = e.id
                                      where a.id = '${serverModel.id}'`))
        return query.length>0?query[0]:null
    }

    async addServer(ctx) {
        const serverModel = new ServerModel(ctx.request.body)
        let res = await prisma.Server.create({
            data: {
                id: serverModel.id || randomUUID(),
                name: serverModel.name,
                domain: serverModel.domain,
                port: serverModel.port,
                http_port: serverModel.http_port,
                https_port: serverModel.https_port,
                has_ssl: serverModel.has_ssl,
                ssl_expired_time: serverModel.ssl_expired_time,
                up_speed: serverModel.up_speed,
                down_speed: serverModel.down_speed,
                is_vip: serverModel.is_vip,
                sort: serverModel.sort,
                creator: serverModel.creator,
                editor: serverModel.editor,
                created_time: serverModel.created_time || new Date().valueOf(),
                modified_time: serverModel.modified_time,
                status: serverModel.status,
                is_delete: serverModel.is_delete,
                remark: serverModel.remark,
            }
        })
        return new ResultModel(res.id, null, true)
    }

    async editServer(ctx) {
        const serverModel = new ServerModel(ctx.request.body)
        serverModel.modified_time = serverModel.modified_time || new Date().valueOf()
        let res = await prisma.Server.update({
            where: {
                id: serverModel.id
            },
            data: serverModel
        });
        return new ResultModel(res.id, null, true)
    }

    delServer(ids) {
        return prisma.Server.updateMany({
            data: {
                is_delete: isDelete.true,
            },
            where: {
                id: {in: ids}
            }
        })
    }

}
