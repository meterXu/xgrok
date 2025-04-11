import {randomUUID} from "../utils/index.js";
import {isDelete} from "../utils/enum.js";

const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();
export default class ClientService {
    constructor() {
    }

    async queryClient(pagination, orderBy, clientModel) {
        return await prisma.$transaction([prisma.ng_client.count({where: clientModel}), prisma.ng_client.findMany({
            where: clientModel,
            orderBy: orderBy,
            skip: (pagination.pageNumber - 1) * pagination.pageSize,
            take: pagination.pageSize
        })])
    }

    async detailClient(clientModel) {
        return await prisma.ng_client.findUnique({where: {id: clientModel.id}})
    }

    async addClient(clientModel) {
        let res = await prisma.ng_client.create({
            data: {
                id: clientModel.id || randomUUID(),
                hostname: clientModel.hostname,
                osVersion: clientModel.osVersion,
                sort: clientModel.sort,
                is_vip: clientModel.is_vip,
                creator: clientModel.creator,
                editor: clientModel.editor,
                created_time: clientModel.created_time,
                modified_time: clientModel.modified_time,
                status: clientModel.status,
                is_delete: clientModel.is_delete,
            }
        })
        return res
    }

    async editClient(clientModel) {
        let res = await prisma.ng_client.update({where: {id: clientModel.id}, data: clientModel});
        return res
    }

    async delClient(id) {
        const res = await prisma.ng_client.update({data: {is_delete: isDelete.true,}, where: {id: id}})
        return res
    }
}