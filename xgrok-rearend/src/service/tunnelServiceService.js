import ResultModel from "../model/sys/resultModel.js";
import {checkServerOnline, randomUUID} from "../utils/index.js";
import {isDelete, status,serviceType} from "../utils/enum.js";
import {Prisma} from "@prisma/client";
import OrderService from "./orderService";
const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();

export default class TunnelServiceService {
    constructor() {
        if(!this.orderService)
            this.orderService = new OrderService()
    }

    async queryTunnelService(pagination,orderBy,tunnelServiceQuery) {
        return await prisma.$transaction([
            prisma.TunnelService.count({
                where: tunnelServiceQuery
            }),
            prisma.TunnelService.findMany({
                where: tunnelServiceQuery,
                orderBy: orderBy,
                skip: (pagination.pageNumber - 1) * pagination.pageSize,
                take: pagination.pageSize
            }),
        ])
    }

    async detailTunnelService(tunnelServiceQuery) {
        let res = await prisma.TunnelService.findUnique({
            where: {
               id: tunnelServiceQuery.id
            }
        })
        return res
    }

    async addTunnelService(tunnelServiceModel) {
        let res = await prisma.TunnelService.create({
            data: {
              id:tunnelServiceModel.id||randomUUID(),
              server_id:tunnelServiceModel.server_id,
              client_id:tunnelServiceModel.client_id,
              name:tunnelServiceModel.name,
              host:tunnelServiceModel.host,
              type:tunnelServiceModel.type,
              port:tunnelServiceModel.port,
              remote_port:tunnelServiceModel.remote_port,
              sort:tunnelServiceModel.sort,
              creator:tunnelServiceModel.creator,
              editor:tunnelServiceModel.editor,
              created_time:tunnelServiceModel.created_time,
              modified_time:tunnelServiceModel.modified_time,
              status:tunnelServiceModel.status,
              is_delete:tunnelServiceModel.is_delete,
              is_remote:tunnelServiceModel.is_remote,
              remark:tunnelServiceModel.remark,
            }
        })
        return res
    }

    async editTunnelService(tunnelServiceModel) {
        let res = await prisma.TunnelService.update({
            where: {
                id: tunnelServiceModel.id
            },
            data: tunnelServiceModel
            });
        return new ResultModel(res.id,null,true)
    }

    async delTunnelService(id) {
        const res = await prisma.TunnelService.update({
              data:{
                  is_delete: isDelete.true,
              },
              where: {
                  id: id
              }
        })
        return new ResultModel(id,null,true)
    }

    async delTunnelServiceBatch(ids) {
        const res = await prisma.TunnelService.updateMany({
            data:{
                is_delete: isDelete.true,
            },
            where: {
                id: {
                    in:ids
                }
            }
        })
        return new ResultModel(res.count,null,true)
    }

    /**
     * 检查服务端口占用情况，true未占用，false占用
     * @param domain 域名
     * @param port 端口号
     * @param server_id 服务端id
     * @param user_id 用户id
     * @param id id
     * @param type 服务类型
     * @return boolean
     */
    async checkPort(domain,port,server_id,user_id,id,type=serviceType.tcp){
        return new Promise(async (resolve, reject) => {
            let existSql = `select sum(num) num from (
            select !count(*) num from ng_port_range where server_id='${server_id}' and (min_port <= ${port} and max_port >= ${port}) 
            and is_delete=${isDelete.false} and status=${status.enable} and type=${type}
            union all
            select count(*) num from ng_tunnel_service where remote_port=${port} and server_id='${server_id}' 
            ${id?` and id!='${id}' `:""}
            and is_delete=${isDelete.false} and status=${status.enable} and type=${type}
            ) a`
            let existRes = await prisma.$queryRaw(Prisma.raw(existSql))
            if(existRes.length>0&&parseInt(existRes[0]['num'])>0) {
                resolve(false)
            }else{
                let service = await this.detailTunnelService({id:id})
                if(service?.remote_port!==port){
                    let res = await checkServerOnline(domain,port)
                    resolve(!res)
                }else{
                    resolve(true)
                }
            }
        })
    }
}
