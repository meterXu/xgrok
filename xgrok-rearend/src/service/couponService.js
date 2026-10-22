const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();
export default class CouponService {
    constructor() {
    }

    queryCoupon(pagination, orderBy, couponModel) {
      if(couponModel.start_time){
        couponModel.start_time = {
          lt:couponModel.start_time
        }
      }
      if(couponModel.end_time){
        couponModel.end_time = {
          gt:couponModel.end_time
        }
      }
      return prisma.$transaction([
        prisma.ng_coupon.count({
          where: couponModel
        }),
        prisma.ng_coupon.findMany({
          where: couponModel,
          orderBy: orderBy,
          skip: (pagination.pageNumber - 1) * pagination.pageSize,
          take: pagination.pageSize
        }),
      ])
    }

    detailCouponByCode(code) {
      return prisma.ng_coupon.findFirst({where: {code: code}})
    }

}
