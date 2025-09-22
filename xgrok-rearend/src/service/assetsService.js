const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();
export default class AssetsService {
    constructor() {
    }
    async queryAssets(pagination,orderBy,assetsQuery){
        return await prisma.$transaction([
            prisma.Assets.count({
                where: assetsQuery
            }),
            prisma.Server.findMany({
                where: assetsQuery,
                orderBy: orderBy,
                skip: (pagination.pageNumber - 1) * pagination.pageSize,
                take: pagination.pageSize
            }),
        ])
    }
}