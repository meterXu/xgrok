import {Prisma} from "@prisma/client";
import {isDelete, payStatus, status} from "../utils/enum.js";

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
        return prisma.$queryRaw`select 'web' as type, count(*) as total
                                from ng_tunnel_web
                                where is_delete = ${isDelete.false}
                                  and status = ${status.enable}
                                  and created_time between ${startTime} AND ${endTime}
                                union all
                                select 'service' as type, count(*) as total
                                from ng_tunnel_service
                                where is_delete = ${isDelete.false}
                                  and status = ${status.enable}
                                  and created_time between ${startTime} AND ${endTime}`
    }

    async serverUsage(startTime,endTime,type='web'){
        return prisma.$queryRaw`select b.name,b.domain,a.type,count(a.type) total from (
                                select 'web' as type,server_id from ng_tunnel_web where is_delete=${isDelete.false} and status=${status.enable} and created_time between ${startTime} AND ${endTime}
                                union all
                                select 'service' as type,server_id from ng_tunnel_service where is_delete=${isDelete.false} and status=${status.enable} and created_time between ${startTime} AND ${endTime}
                                ) a
                                inner join ng_server b on a.server_id = b.id and b.is_delete=${isDelete.false} and b.status=${status.enable}
                                where a.type=${type}
                                group by b.name,b.domain,a.type`
    }
}