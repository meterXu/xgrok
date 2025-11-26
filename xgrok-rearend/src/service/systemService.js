import {Prisma} from "@prisma/client";
import {isDelete, payStatus, status} from "../utils/enum.js";

const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();

export default class SystemService {
    constructor() {
    }
    async numberStatistics(startTime, endTime) {
        let querySql = `
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
        let records =  await prisma.$queryRaw(Prisma.raw(querySql))
        return {
            newData:records[0],
            totalData:records[1]
        }
    }
}