import {Prisma} from "@prisma/client";
import {isDelete, payStatus, serviceType, status} from "../utils/enum.js";
import {sleep, speedValueFmt, storageValueFmt} from '../utils'
import {performance} from "perf_hooks";
import net from "net";
import axios from "axios";

const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();

export default class SystemService {
    constructor() {
    }

    async numberStatistics(startTime, endTime) {
        let records = await prisma.$queryRaw`
            SELECT COALESCE(order_data.order_count, 0)  AS order_count,
                   COALESCE(user_data.user_count, 0)    AS user_count,
                   COALESCE(sales_data.sales_volume, 0) AS sales_volume
            FROM (SELECT COUNT(*) AS order_count
                  FROM ng_order
                  WHERE pay_status IN (${payStatus.paymentSuccess}, ${payStatus.paymentFinished})
                    AND is_delete = ${isDelete.false}
                    AND created_time BETWEEN ${startTime} AND ${endTime}) AS order_data,
                 (SELECT COUNT(*) AS user_count
                  FROM oauth_users
                  WHERE status = ${status.enable}
                    AND is_delete = ${isDelete.false}
                    AND created_time BETWEEN ${startTime} AND ${endTime}) AS user_data,
                 (SELECT ROUND(SUM(pay_total_amount), 2) AS sales_volume
                  FROM ng_order
                  WHERE is_delete = ${isDelete.false}
                    AND pay_status IN (${payStatus.paymentSuccess}, ${payStatus.paymentFinished})
                    AND created_time BETWEEN ${startTime} AND ${endTime}) AS sales_data
            union all
            SELECT COALESCE(order_data.order_count, 0)  AS order_count,
                   COALESCE(user_data.user_count, 0)    AS user_count,
                   COALESCE(sales_data.sales_volume, 0) AS sales_volume
            FROM (SELECT COUNT(*) AS order_count
                  FROM ng_order
                  WHERE pay_status IN (${payStatus.paymentSuccess}, ${payStatus.paymentFinished})
                    AND is_delete = ${isDelete.false}) AS order_data,
                 (SELECT COUNT(*) AS user_count
                  FROM oauth_users
                  WHERE status = ${status.enable}
                    AND is_delete = ${isDelete.false}) AS user_data,
                 (SELECT ROUND(SUM(pay_total_amount), 2) AS sales_volume
                  FROM ng_order
                  WHERE is_delete = ${isDelete.false}
                    AND pay_status IN (${payStatus.paymentSuccess}, ${payStatus.paymentFinished})) AS sales_data`
        return {
            newData: records[0],
            totalData: records[1]
        }
    }

    async salesVolumeStatistics(startTime, endTime, type='web') {
        let querySql = null;
        switch (type) {
            case 'year': {
                querySql = Prisma.sql`select
                                YEAR(FROM_UNIXTIME(created_time/1000)) AS year, round(sum(pay_total_amount), 2) amount
                                from ng_order
                                where is_delete = ${isDelete.false}
                                AND pay_status IN (${payStatus.paymentSuccess}, ${payStatus.paymentFinished})
                                AND created_time BETWEEN ${startTime} AND ${endTime}
                                group by year order by year asc`
            }
                break;
            case 'month': {
                querySql = Prisma.sql`select
                                YEAR(FROM_UNIXTIME(created_time/1000)) AS year, MONTH(FROM_UNIXTIME(created_time/1000)) AS month, round(sum(pay_total_amount), 2) amount
                                from ng_order
                                where is_delete = ${isDelete.false}
                                AND pay_status IN (${payStatus.paymentSuccess}, ${payStatus.paymentFinished})
                                AND created_time BETWEEN ${startTime} AND ${endTime}
                                group by year, month
                                order by year asc, month asc`
            }
                break;
            case 'week': {
                querySql = Prisma.sql`select
                                YEAR (FROM_UNIXTIME(created_time/1000)) AS year, WEEK(FROM_UNIXTIME(created_time/1000), 0) AS week, round(sum(pay_total_amount), 2) amount
                                from ng_order
                                where is_delete = ${isDelete.false}
                                AND pay_status IN (${payStatus.paymentSuccess}, ${payStatus.paymentFinished})
                                AND created_time BETWEEN ${startTime}
                                AND ${endTime}
                                group by year, week
                                order by year asc, week asc`
            }
                break;
        }
        return prisma.$queryRaw(querySql)
    }

    async productSales(startTime, endTime) {
        return prisma.$queryRaw`select b.name, count(a.id) as \`value\`
                          from ng_order a
                                   inner join ng_product b on a.product_id = b.id
                          where a.is_delete = ${isDelete.false}
                            and a.pay_status in (${payStatus.paymentSuccess}, ${payStatus.paymentFinished})
                            and b.is_delete = ${isDelete.false}
                            and b.status = ${status.enable}
                            and a.created_time between ${startTime} AND ${endTime}
                          group by b.name
                          order by \`value\` desc`
    }

    async userOrderTop(startTime, endTime,top=10) {
        return prisma.$queryRaw`select a.username,count(b.id) order_count from oauth_users a
                               inner join ng_order b on a.id = b.creator and a.is_delete=${isDelete.false} and a.status=${status.enable} and b.is_delete=${isDelete.false}
                               and b.pay_status in (${payStatus.paymentSuccess}, ${payStatus.paymentFinished}) and b.created_time between ${startTime} AND ${endTime}
                               group by a.username order by order_count desc
                               limit ${top}`
    }

    async userTunnelTop(startTime, endTime, top=10,type='web'){
        return prisma.$queryRaw`select a.username,count(b.type) tunnel_count from oauth_users a
                               inner join (
                                    select 'web' as type,creator from ng_tunnel_web where is_delete=${isDelete.false} and status=${status.enable}
                                    union all
                                    select 'service' as type,creator from ng_tunnel_service where is_delete=${isDelete.false} and status=${status.enable}
                               ) b on a.id = b.creator and a.is_delete=${isDelete.false} and a.status=${status.enable}
                               where b.type= ${type}
                               group by a.username order by tunnel_count desc limit ${top}`
    }

    async tunnelUsage(startTime, endTime){
        return prisma.$queryRaw`select 'web' as name, count(*) as \`value\`
                                from ng_tunnel_web
                                where is_delete = ${isDelete.false}
                                  and status = ${status.enable}
                                  and created_time between ${startTime} AND ${endTime}
                                union all
                                select 'service' as name, count(*) as \`value\`
                                from ng_tunnel_service
                                where is_delete = ${isDelete.false}
                                  and status = ${status.enable}
                                  and created_time between ${startTime} AND ${endTime}`
    }

    async serverUsage(startTime,endTime,type='web'){
        return prisma.$queryRaw`select b.name,b.domain,a.type,count(a.type) \`value\` from (
                                select 'web' as type,server_id from ng_tunnel_web where is_delete=${isDelete.false} and status=${status.enable} and created_time between ${startTime} AND ${endTime}
                                union all
                                select 'service' as type,server_id from ng_tunnel_service where is_delete=${isDelete.false} and status=${status.enable} and created_time between ${startTime} AND ${endTime}
                                ) a
                                inner join ng_server b on a.server_id = b.id and b.is_delete=${isDelete.false} and b.status=${status.enable}
                                where a.type=${type}
                                group by b.name,b.domain,a.type`
    }

    async checkTcpLatency(serverId,timeout=5000){
        return new Promise(async (resolve, reject) => {
            const server = await prisma.Server.findUnique({
                where: {
                    id:serverId
                }
            })
            const socket = new net.Socket();
            const start = performance.now();
            socket.setTimeout(timeout);
            socket.connect(server.port, server.domain, () => {
                const latency = performance.now() - start;
                socket.destroy();
                resolve(latency.toFixed(3));
            });
            socket.on('error', (err) => {
                socket.destroy();
                reject(`连接错误: ${err.message}`);
            });
            socket.on('timeout', () => {
                socket.destroy();
                reject('连接超时');
            });
        });
    }

    speedAndTraffic(serverId,clientId,creator){
        return new Promise(async (resolve, reject) => {
            try{
                let sourceQuery = await prisma.$transaction([
                    prisma.Server.findUnique({
                        where:{
                            id:serverId,
                        }
                    }),
                    prisma.TunnelWeb.findMany({
                        where:{
                            server_id:serverId,
                            client_id:clientId,
                            creator:creator,
                            status:status.enable,
                            is_delete:isDelete.false
                        }
                    }),
                    prisma.TunnelService.findMany({
                        where:{
                            server_id:serverId,
                            client_id:clientId,
                            creator:creator,
                            status:status.enable,
                            is_delete:isDelete.false
                        }
                    })
                ])
                const tunnelSet = new Set([
                    ...sourceQuery[1].map(c=>`frp_server_traffic_out{name="${c.name}",type="http"}`),
                    ...sourceQuery[2].map(c=>`frp_server_traffic_out{name="${c.name}",type="${c.type===serviceType.tcp?'tcp':'udp'}"}`)
                ])
                let lastTotalOut = 0;
                let lastTime = Date.now();
                let speed = 0;
                let traffic = 0;
                async function samplingNetwork(){
                    const res = await axios.get(`http://${sourceQuery[0].domain}:7400/metrics`, {
                        auth: {
                            username: 'xgrok',
                            password: 'xgrok'
                        }
                    });
                    const now = Date.now();
                    const lines = res.data.split('\n');
                    let currentTotalOut = 0;
                    for (const line of lines) {
                        // 仅处理包含目标的行
                        if (line.startsWith('frp_server_traffic_out') && tunnelSet.has(line.split(' ')[0])) {
                            const parts = line.split(' ');
                            const val = parseFloat(parts[1]); // 使用 parseFloat 兼容科学计数法
                            if (!isNaN(val)) currentTotalOut += val;
                        }
                    }
                    //获取用户客户端下的启用隧道的总字节数
                    if (lastTotalOut > 0) {
                        const timeDiff = (now - lastTime) / 1000;
                        const ByteDiff = currentTotalOut - lastTotalOut;
                        const Bs = ByteDiff/ timeDiff;
                        speed = speedValueFmt(Bs)
                        traffic = storageValueFmt(ByteDiff)
                    }
                    lastTotalOut = currentTotalOut;
                    lastTime = now;
                }
                // 采样两次计算差值
                await samplingNetwork();
                await sleep(3000); // 采样间隔越长，速率越平稳
                await samplingNetwork();
                resolve({
                    speed,
                    traffic
                })
            }catch (err){
                resolve({
                    speed:0,
                    traffic:0
                });
            }
        })

    }


}
