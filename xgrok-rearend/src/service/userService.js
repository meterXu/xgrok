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
            if(countRes[type]>=1){
                return new ResultModel(countRes,"抱歉！免费计划用户只能添加一个网页隧道和一个服务隧道！",false)
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

    async checkLocalPort(server_id,client_id,port){
        let querySql = `select count(*) total from (
                            select port from ng_tunnel_web
                            where is_remote=1 and client_id='${client_id}' and server_id='${server_id}'
                            and port=${port}
                            union
                            select port from ng_tunnel_service
                            where is_remote=1 and client_id='${client_id}' and server_id='${server_id}'
                            and port=${port}
                            ) a`
        let queryRes = await prisma.$queryRaw(Prisma.raw(querySql))
        return parseInt(queryRes[0]['total'])===0
    }
}