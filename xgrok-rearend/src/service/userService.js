import {isDelete, status, VIPType} from "../utils/enum.js";
import {Prisma} from "@prisma/client";
import TunnelWebService from "./tunnelWebService.js";
import TunnelServiceService from "./tunnelServiceService.js";
import ResultModel from "../model/sys/resultModel.js";
import OrderService from "./orderService.js";

const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();
export default class UserService {
    constructor() {
        if(!this.tunnelWebService)
            this.tunnelWebService = new TunnelWebService()
        if(!this.tunnelServiceService)
            this.tunnelServiceService = new TunnelServiceService()
        if(!this.orderService)
            this.orderService = new OrderService()
    }

    async queryTunnelWebConfig(serverId,userId,clientId){
        let querySql = `
        select a.* from ng_tunnel_web a
        where a.creator='${userId}' and server_id='${serverId}' and client_id='${clientId}' and a.is_delete=${isDelete.false} and a.status=${status.enable}
        order by created_time desc,sort asc`
        return prisma.$queryRaw(Prisma.raw(querySql))
    }

    async queryTunnelServiceConfig(serverId,userId,clientId){
        let querySql = `
        select a.* from ng_tunnel_service a
        where a.creator='${userId}' and server_id='${serverId}' and client_id='${clientId}' and a.is_delete=${isDelete.false} and a.status=${status.enable}
        order by created_time desc,sort asc`
        return prisma.$queryRaw(Prisma.raw(querySql))
    }

    async checkTunnelNum(userId,server_id,client_id,type){
        let nowPlan = await this.orderService.queryPayPlan(userId)
        if(nowPlan.value===VIPType.no.value){
            let countRes = await this.queryTunnelCount(userId,server_id,client_id)
            if((type === 'web' && countRes[type]>=1)||type === 'service'){
                return new ResultModel(countRes,"抱歉！免费计划用户只能添加一个网页隧道！",false)
            }
        }
        return new ResultModel(null,null,true)
    }

    async queryTunnelCount(userId,serverId,client_id){
        let querySql = `select * from (
            select a.name,b.hostname,'web' as type from ng_tunnel_web a
        inner join ng_client b on a.client_id = b.id
        where a.status = ${status.enable} and a.is_delete = ${isDelete.false}
          and b.status = ${status.enable} and b.is_delete = ${isDelete.false}
          and a.creator ='${userId}' and a.server_id='${serverId}' and a.client_id='${client_id}'
        union all
        select a.name,b.hostname,'service' as type  from ng_tunnel_service a
        inner join ng_client b on a.client_id = b.id
        where a.status = ${status.enable} and a.is_delete = ${isDelete.false}
          and b.status = ${status.enable} and b.is_delete = ${isDelete.false}
          and a.creator ='${userId}' and a.server_id='${serverId}' and a.client_id='${client_id}'
                      ) a order by hostname desc`
        let queryRes = await prisma.$queryRaw(Prisma.raw(querySql))
        return {
            web:queryRes.filter(c=>c.type==='web').length,
            service:queryRes.filter(c=>c.type==='service').length,
            records:queryRes
        }
    }

    async queryManageTunnelWebConfig(pagination,userId){
        const where = [
            `a.status = ${status.enable}`,
            `a.is_delete = ${isDelete.false}`,
            `a.creator='${userId}'`
        ].filter(c => c).join(' and ')
        const totalSql = `select count(a.id) _all from ng_tunnel_web a ${where ? `where ${where}` : ''}`
        let querySql = `select a.id,b.name server_name,b.id as server_id,c.hostname,c.id as client_id,
                               a.name as name,b.domain,b.http_port,b.https_port,
                               a.host,a.type,a.port,a.remark,a.status,a.is_delete from ng_tunnel_web as a
                               left join ng_server b on a.server_id = b.id
                               left join ng_client c on a.client_id = c.id
                               ${where ? `where ${where}` : ''}
                               order by a.created_time desc
                               limit ${(pagination.pageNumber - 1) * pagination.pageSize},${pagination.pageSize}`
        let totalRes = await prisma.$queryRaw(Prisma.raw(totalSql))
        let recordRes = await prisma.$queryRaw(Prisma.raw(querySql))
        return [totalRes[0]._all,recordRes]
    }

    async queryManageTunnelServiceConfig(pagination,userId){
        const where = [
            `a.status = ${status.enable}`,
            `a.is_delete = ${isDelete.false}`,
            `a.creator='${userId}'`
        ].filter(c => c).join(' and ')
        const totalSql = `select count(a.id) _all from ng_tunnel_service a ${where ? `where ${where}` : ''}`
        let querySql = `select a.id,b.name server_name,b.id as server_id,c.hostname,c.id as client_id,
                               a.name as name,
                               b.domain,a.remote_port,a.type,a.host,a.port,a.remark,a.status,a.is_delete
                               from ng_tunnel_service as a
                               left join ng_server b on a.server_id = b.id
                               left join ng_client c on a.client_id = c.id
                               ${where ? `where ${where}` : ''}
                               order by a.created_time desc
                               limit ${(pagination.pageNumber - 1) * pagination.pageSize},${pagination.pageSize}`
        let totalRes = await prisma.$queryRaw(Prisma.raw(totalSql))
        let recordRes = await prisma.$queryRaw(Prisma.raw(querySql))
        return [totalRes[0]._all,recordRes]
    }
}
