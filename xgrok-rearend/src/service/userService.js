import {isDelete, status, VIPType} from "../utils/enum.js";
import {Prisma} from "@prisma/client";
import TunnelWebService from "./tunnelWebService.js";
import TunnelServiceService from "./tunnelServiceService.js";
import ResultModel from "../model/sys/resultModel.js";
import OrderService from "./orderService.js";
import {randomString} from "../utils";

const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();
export default class UserService {
    constructor() {
        if (!this.tunnelWebService)
            this.tunnelWebService = new TunnelWebService()
        if (!this.tunnelServiceService)
            this.tunnelServiceService = new TunnelServiceService()
        if (!this.orderService)
            this.orderService = new OrderService()
    }

    async queryTunnelWebConfig(serverId, userId, clientId) {
        let querySql = `
            select a.*
            from ng_tunnel_web a
            where a.creator = '${userId}'
              and server_id = '${serverId}'
              and client_id = '${clientId}'
              and a.is_delete = ${isDelete.false}
            order by created_time desc, sort asc`
        return prisma.$queryRaw(Prisma.raw(querySql))
    }

    async queryTunnelServiceConfig(serverId, userId, clientId) {
        let querySql = `
            select a.*
            from ng_tunnel_service a
            where a.creator = '${userId}'
              and server_id = '${serverId}'
              and client_id = '${clientId}'
              and a.is_delete = ${isDelete.false}
            order by created_time desc, sort asc`
        return prisma.$queryRaw(Prisma.raw(querySql))
    }

    async checkTunnelNum(userId, server_id, client_id, type) {
        let nowPlan = await this.orderService.queryPayPlan(userId)
        if (nowPlan.value === VIPType.no.value) {
            let countRes = await this.queryTunnelCount(userId, server_id, client_id)
            if (countRes[type] >= 1) {
                return new ResultModel(countRes, "抱歉！免费计划用户只能添加一个网页隧道和一个服务隧道！", false)
            }
        }
        return new ResultModel(null, null, true)
    }

    async queryTunnelCount(userId, serverId, clientId) {
        let where = [
            `a.status = ${status.enable}`,
            `a.is_delete = ${isDelete.false}`,
            `b.status = ${status.enable}`,
            `b.is_delete = ${isDelete.false}`,
            userId && `a.creator = '${userId}'`,
            serverId && `a.server_id = '${serverId}'`,
            clientId && `a.client_id = '${clientId}'`
        ].filter(c => c).join(' and ')
        let whereAll = [
            `a.status = ${status.enable}`,
            `a.is_delete = ${isDelete.false}`,
            `b.status = ${status.enable}`,
            `b.is_delete = ${isDelete.false}`,
            userId && `a.creator = '${userId}'`,
            serverId && `a.server_id = '${serverId}'`
        ].filter(c => c).join(' and ')
        let webQuery = `select a.*
                        from ng_tunnel_web a
                                 inner join ng_client b on a.client_id = b.id
                            ${where ? `where ${where}` : ''}
                        order by b.hostname desc`
        let webQueryAll = `select a.*
                                 from ng_tunnel_web a
                                          inner join ng_client b on a.client_id = b.id
                                     ${whereAll ? `where ${whereAll}` : ''}
                                 order by b.hostname desc`
        let serviceQuery = `select a.*
                            from ng_tunnel_service a
                                     inner join ng_client b on a.client_id = b.id
                                ${where ? `where ${where}` : ''}
                            order by b.hostname desc`
        let serviceQueryAll = `select a.*
                                     from ng_tunnel_service a
                                              inner join ng_client b on a.client_id = b.id
                                         ${whereAll ? `where ${whereAll}` : ''}
                                     order by b.hostname desc`
        let queryRes = await prisma.$transaction([
            prisma.$queryRaw(Prisma.raw(webQuery)),
            prisma.$queryRaw(Prisma.raw(serviceQuery)),
            prisma.$queryRaw(Prisma.raw(webQueryAll)),
            prisma.$queryRaw(Prisma.raw(serviceQueryAll)),
        ])
        return {
            web: queryRes[0],
            service: queryRes[1],
            allWeb: queryRes[2],
            allService: queryRes[3],
        }
    }

    async queryManageTunnelWebConfig(pagination, userId) {
        const where = [
            `a.status = ${status.enable}`,
            `a.is_delete = ${isDelete.false}`,
            `a.creator='${userId}'`
        ].filter(c => c).join(' and ')
        const totalSql = `select count(a.id) _all
                          from ng_tunnel_web a ${where ? `where ${where}` : ''}`
        let querySql = `select a.id,
                               b.name    server_name,
                               b.id   as server_id,
                               c.hostname,
                               c.id   as client_id,
                               a.name as name,
                               b.domain,
                               b.http_port,
                               b.https_port,
                               a.host,
                               a.type,
                               a.port,
                               a.remark,
                               a.status,
                               a.is_delete
                        from ng_tunnel_web as a
                                 left join ng_server b on a.server_id = b.id
                                 left join ng_client c on a.client_id = c.id
                            ${where ? `where ${where}` : ''}
                        order by a.created_time desc
                            limit ${(pagination.pageNumber - 1) * pagination.pageSize}, ${pagination.pageSize}`
        let totalRes = await prisma.$queryRaw(Prisma.raw(totalSql))
        let recordRes = await prisma.$queryRaw(Prisma.raw(querySql))
        return [totalRes[0]._all, recordRes]
    }

    async queryManageTunnelServiceConfig(pagination, userId) {
        const where = [
            `a.status = ${status.enable}`,
            `a.is_delete = ${isDelete.false}`,
            `a.creator='${userId}'`
        ].filter(c => c).join(' and ')
        const totalSql = `select count(a.id) _all
                          from ng_tunnel_service a ${where ? `where ${where}` : ''}`
        let querySql = `select a.id,
                               b.name    server_name,
                               b.id   as server_id,
                               c.hostname,
                               c.id   as client_id,
                               a.name as name,
                               b.domain,
                               a.remote_port,
                               a.type,
                               a.host,
                               a.port,
                               a.remark,
                               a.status,
                               a.is_delete
                        from ng_tunnel_service as a
                                 left join ng_server b on a.server_id = b.id
                                 left join ng_client c on a.client_id = c.id
                            ${where ? `where ${where}` : ''}
                        order by a.created_time desc
                            limit ${(pagination.pageNumber - 1) * pagination.pageSize}, ${pagination.pageSize}`
        let totalRes = await prisma.$queryRaw(Prisma.raw(totalSql))
        let recordRes = await prisma.$queryRaw(Prisma.raw(querySql))
        return [totalRes[0]._all, recordRes]
    }

    async getRandomSubName(serverId) {
        const subName = randomString(6)
        let randomCount = 0
        while (randomCount < 10) {
            const tunnels = await prisma.$transaction([
                prisma.TunnelWeb.findMany({
                    where: {
                        server_id: serverId,
                        name: subName,
                        status: status.enable,
                        is_delete: isDelete.false
                    }
                }),
                prisma.TunnelService.findMany({
                    where: {
                        server_id: serverId,
                        name: subName,
                        status: status.enable,
                        is_delete: isDelete.false
                    }
                })
            ])
            if ((tunnels[0].length+tunnels[1].length) === 0) {
                return subName
            } else {
                randomCount++
            }
        }
        return null
    }

    async validateServerNameAndSecret(serverId,serverName,secretKey) {
        let where = [
            `a.server_id = '${serverId}'`,
            `a.name = '${serverName}'`,
            `a.secret_key = '${secretKey}'`,
        ].filter(c => c).join(' and ')
        let totalSql = `select count(a.id) _all from ng_tunnel_service a ${where ? `where ${where}` : ''}`
        let totalRes = await prisma.$queryRaw(Prisma.raw(totalSql))
        return totalRes[0]._all>0
    }

    async queryTunnelStatistics(userId, serverId, clientId){
        let where = [
            `a.status = ${status.enable}`,
            `a.is_delete = ${isDelete.false}`,
            `b.status = ${status.enable}`,
            `b.is_delete = ${isDelete.false}`,
            userId && `a.creator = '${userId}'`,
            serverId && `a.server_id = '${serverId}'`,
            clientId && `a.client_id = '${clientId}'`
        ].filter(c => c).join(' and ')
        let whereAll = [
            `a.status = ${status.enable}`,
            `a.is_delete = ${isDelete.false}`,
            `b.status = ${status.enable}`,
            `b.is_delete = ${isDelete.false}`,
            userId && `a.creator = '${userId}'`,
            serverId && `a.server_id = '${serverId}'`
        ].filter(c => c).join(' and ')
        let webQuery = `select count(a.id) as num
                        from ng_tunnel_web a
                                 inner join ng_client b on a.client_id = b.id
                            ${where ? `where ${where}` : ''}
                        order by b.hostname desc`
        let webQueryAll = `select count(a.id) as num
                                 from ng_tunnel_web a
                                          inner join ng_client b on a.client_id = b.id
                                     ${whereAll ? `where ${whereAll}` : ''}
                                 order by b.hostname desc`
        let serviceQuery = `select count(a.id) as num
                            from ng_tunnel_service a
                                     inner join ng_client b on a.client_id = b.id
                                ${where ? `where ${where}` : ''}
                            order by b.hostname desc`
        let serviceQueryAll = `select count(a.id) as num
                                     from ng_tunnel_service a
                                              inner join ng_client b on a.client_id = b.id
                                         ${whereAll ? `where ${whereAll}` : ''}
                                     order by b.hostname desc`
        let queryRes = await prisma.$transaction([
            prisma.$queryRaw(Prisma.raw(webQuery)),
            prisma.$queryRaw(Prisma.raw(serviceQuery)),
            prisma.$queryRaw(Prisma.raw(webQueryAll)),
            prisma.$queryRaw(Prisma.raw(serviceQueryAll)),
        ])
        return {
            web: queryRes[0][0]['num'],
            service: queryRes[1][0]['num'],
            allWeb: queryRes[2][0]['num'],
            allService: queryRes[3][0]['num'],
        }
    }
}
