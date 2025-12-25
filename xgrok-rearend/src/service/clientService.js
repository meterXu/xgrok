import {randomUUID} from "../utils/index.js";
import {isDelete} from "../utils/enum.js";

const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();
export default class ClientService {
    constructor() {
    }

    async queryClient(pagination, orderBy, clientModel) {
        const _where = {
            OR: [
                {hostname:clientModel.hostname},
                {deviceId:clientModel.deviceId},
            ]
        }
        return await prisma.$transaction([prisma.ng_client.count({where: clientModel}), prisma.ng_client.findMany({
            where: _where,
            orderBy: orderBy,
            skip: (pagination.pageNumber - 1) * pagination.pageSize,
            take: pagination.pageSize
        })])
    }

    async detailClient(clientModel) {
        return await prisma.ng_client.findUnique({where: {id: clientModel.id}})
    }

    addClient(clientModel) {
        return prisma.ng_client.create({
            data: {
                id: clientModel.id || randomUUID(),
                hostname: clientModel.hostname,
                osVersion: clientModel.osVersion,
                deviceId: clientModel.deviceId,
                sort: clientModel.sort,
                is_vip: clientModel.is_vip,
                creator: clientModel.creator,
                editor: clientModel.editor,
                created_time: clientModel.created_time||new Date().valueOf(),
                modified_time: clientModel.modified_time,
                status: clientModel.status,
                is_delete: clientModel.is_delete,
            }
        })
    }

    editClient(clientModel) {
        clientModel.modified_time = clientModel.modified_time||new Date().valueOf()
        return prisma.ng_client.update({where: {id: clientModel.id}, data: clientModel});
    }

    delClient(id) {
        return prisma.ng_client.update({data: {is_delete: isDelete.true,}, where: {id: id}})
    }
}
