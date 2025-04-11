import ResultModel from "../model/sys/resultModel.js";
import {randomUUID} from "../utils/index.js";
import {isDelete, status, tunnelType} from "../utils/enum.js";
import {Prisma} from "@prisma/client";
const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();

export default class TunnelWebService {
    constructor() {
    }

    async queryTunnelWeb(pagination,orderBy,tunnelWebQuery) {
        return await prisma.$transaction([
            prisma.TunnelWeb.count({
                where: tunnelWebQuery
            }),
            prisma.TunnelWeb.findMany({
                where: tunnelWebQuery,
                orderBy: orderBy,
                skip: (pagination.pageNumber - 1) * pagination.pageSize,
                take: pagination.pageSize
            }),
        ])
    }

    async detailTunnelWeb(tunnelWebQuery) {
        return await prisma.TunnelWeb.findUnique({
            where: {
               id: tunnelWebQuery.id
            }
        })
    }

    async addTunnelWeb(tunnelWebModel) {
        let res = await prisma.TunnelWeb.create({
            data: {
              id:tunnelWebModel.id||randomUUID(),
              server_id:tunnelWebModel.server_id,
              client_id:tunnelWebModel.client_id,
              name:tunnelWebModel.name,
              host:tunnelWebModel.host,
              type:tunnelWebModel.type,
              port:tunnelWebModel.port,
              sort:tunnelWebModel.sort,
              creator:tunnelWebModel.creator,
              editor:tunnelWebModel.editor,
              created_time:tunnelWebModel.created_time,
              modified_time:tunnelWebModel.modified_time,
              status:tunnelWebModel.status,
              is_delete:tunnelWebModel.is_delete,
              is_remote:tunnelWebModel.is_remote,
              remark:tunnelWebModel.remark,
            }
        })
        return new ResultModel(res.id,null,true)
    }

    async editTunnelWeb(tunnelWebModel) {
        let res = await prisma.TunnelWeb.update({
            where: {
                id: tunnelWebModel.id
            },
            data: tunnelWebModel
            });
        return new ResultModel(res.id,null,true)
    }

    async delTunnelWeb(id) {
        const res = await prisma.TunnelWeb.update({
              data:{
                  is_delete: isDelete.true,
              },
              where: {
                  id: id
              }
        })
        return new ResultModel(id,null,true)
    }

    async delTunnelWebBatch(ids) {
        const res = await prisma.TunnelWeb.updateMany({
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
     * 检查名称占用情况，true未占用，false占用
     */
    async checkWeb(name,type,domain,port,server_id,user_id,client_id,tunnel_id){
        return new Promise(async (resolve, reject) => {
            const existSql = `select sum(num) as num from (
            select count(*) num from ng_tunnel_web where name ='${name}' and server_id='${server_id}' 
            ${tunnel_id?` and id!='${tunnel_id}' `:""}
            ${type===tunnelType.service?`and client_id='${client_id}' and creator='${user_id}'`:""}
            and is_delete=${isDelete.false} and status=${status.enable}
            union
            select count(*) num from ng_tunnel_service where name = '${name}' and server_id='${server_id}' and client_id='${client_id}' and creator='${user_id}' 
            ${tunnel_id?` and id!='${tunnel_id}' `:""}
            and is_delete=${isDelete.false} and status=${status.enable}
            ) a`
            let existRes = await prisma.$queryRaw(Prisma.raw(existSql))
            if(existRes.length>0&&parseInt(existRes[0]['num'])>0){
                resolve(false)
            }else{
                //todo 备案之后再说
                resolve(true)
                // const timeoutPromise = new Promise((resolve, reject) => {
                //     const timer = setTimeout(() => {
                //         clearTimeout(timer);
                //         resolve(new Error('请求超时'));
                //     }, 3000);
                // });
                // Promise.race([axios.get(`http://${name}.${domain}:${port}/`), timeoutPromise])
                //     .then(response=>{
                //         resolve(false)
                //     }).catch(err=>{
                //     resolve(true)
                // })
            }
        })

    }

}
