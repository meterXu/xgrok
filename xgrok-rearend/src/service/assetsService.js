const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();
const {status}  = require('../utils/enum')
export default class AssetsService {
    constructor() {
    }
    async queryAssets(pagination,orderBy,assetsQuery){
        return await prisma.$transaction([
            prisma.ng_assets.count({
                where: assetsQuery
            }),
            prisma.ng_assets.findMany({
                where: assetsQuery,
                orderBy: orderBy,
                skip: (pagination.pageNumber - 1) * pagination.pageSize,
                take: pagination.pageSize
            }),
        ])
    }

    async detailAssets(AssetsModel) {
        return prisma.ng_assets.findFirst({
            where: {
                name: AssetsModel.name,
                status:status.enable
            }
        })
    }
}