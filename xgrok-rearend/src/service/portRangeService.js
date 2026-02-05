import ResultModel from "../model/sys/resultModel.js";
import {randomUUID} from "../utils/index.js";
import {isDelete, status} from "../utils/enum.js";
import PortRangeModel from "../model/portRangeModel.js";

const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();

export default class PortRangeService {
    constructor() {
    }

    async queryPortRange(pagination, orderBy, portRangeModel) {
        let res = await prisma.$transaction([
            prisma.PortRange.count({
                where: portRangeModel
            }),
            prisma.PortRange.findMany({
                where: portRangeModel,
                orderBy: orderBy,
                skip: (pagination.pageNumber - 1) * pagination.pageSize,
                take: pagination.pageSize
            }),
        ])

        return new ResultModel({
            total: res[0],
            records: res[1],
            pagination: pagination
        }, null, true)
    }

    async detailPortRange(portRangeModel) {
        return prisma.PortRange.findUnique({
            where: {
                id: portRangeModel.id
            }
        })
    }

    async addPortRange(ctx) {
        const portRangeModel = new PortRangeModel(ctx.request.body)
        let res = await prisma.PortRange.create({
            data: {
                id: portRangeModel.id || randomUUID(),
                server_id: portRangeModel.server_id,
                min_port: portRangeModel.min_port,
                max_port: portRangeModel.max_port,
                type: portRangeModel.type,
                sort: portRangeModel.sort,
                creator: portRangeModel.creator,
                editor: portRangeModel.editor,
                created_time: portRangeModel.created_time || new Date().valueOf(),
                modified_time: portRangeModel.modified_time,
                status: portRangeModel.status,
                is_delete: portRangeModel.is_delete
            }
        })
        return new ResultModel(res.id, null, true)
    }

    async editPortRange(ctx) {
        const portRangeModel = new PortRangeModel(ctx.request.body)
        portRangeModel.modified_time = portRangeModel.modified_time || new Date().valueOf()
        let res = await prisma.PortRange.update({
            where: {
                id: portRangeModel.id
            },
            data: portRangeModel
        });
        return new ResultModel(res.id, null, true)
    }

    async delPortRange(ids) {
        const res = await prisma.PortRange.updateMany({
            data: {
                is_delete: isDelete.true,
            },
            where: {
                id: {
                    in: ids
                }
            }
        })
        return new ResultModel(res.count, null, true)
    }

    async getFreePortRange(serverId, type) {
        const portRanges = await prisma.PortRange.findMany({
            select: {
                min_port: true,
                max_port: true
            },
            where: {
                server_id: serverId,
                type,
                status: status.enable,
                is_delete: isDelete.false
            }
        })
        if (portRanges.length > 0) {
            let serviceConfigs = await prisma.TunnelService.findMany({
                select: {
                    remote_port: true
                },
                where: {
                    is_delete: isDelete.false,
                    server_id: serverId
                }
            })
            serviceConfigs = serviceConfigs.map(c => c.remote_port)
            const randomIndex = Math.floor(Math.random() * portRanges.length)
            let portRangeArray = Array.from({length: portRanges[randomIndex].max_port - portRanges[randomIndex].min_port}, (_, index) => portRanges[randomIndex].min_port + index)
            portRangeArray = portRangeArray.filter(c => !serviceConfigs.some(s => s === c))
            return portRangeArray.length > 0 ? portRangeArray[Math.floor(Math.random() * portRangeArray.length)] : null
        } else {
            return null
        }
    }
}
