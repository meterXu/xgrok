import OAuthUsersModel from "../model/oauthUsersModel.js";
import {isDelete, roleId, status} from "../utils/enum.js";
import {Prisma} from "@prisma/client";
import {isNullOrUndefined, randomUUID} from "../utils/index.js";
import EmailService from "./emailService.js";
import OrderByModel from "../model/sys/orderByModel.js";
import PaginationModel from "../model/sys/paginationModel.js";
const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();

export default class OAuthUsersService {
    constructor() {
        if(!this.emailService)
            this.emailService = new EmailService()
    }

    async queryOAuthUsers(query) {
        let oauthUsersModel = new OAuthUsersModel(query)
        let where = [
            oauthUsersModel.username && `a.username = '${oauthUsersModel.username}'`,
            `a.is_delete = ${isDelete.false}`,
        ].filter(c => c).join(' and ')

        let querySql = `
            select a.id,a.username,a.password,a.nickname,a.created_time,c.type,a.status from oauth_users a
            inner join oauth_user_role b on a.id=b.user_id and b.is_delete=${isDelete.false} and b.status=${status.enable}
            inner join oauth_role c on c.id=b.role_id and c.is_delete=${isDelete.false} and c.status=${status.enable}
            ${where ? `where ${where}` : ''}`

        let recordRes = await prisma.$queryRaw(Prisma.raw(querySql))

        if(recordRes.length>0){
            return recordRes[0]
        }else{
            return null
        }

    }

    async register(userModel,validateCode){
        userModel.id = randomUUID()
        const res = await prisma.$transaction([
            prisma.OAuthUsers.create({
                data: {
                    id: userModel.id,
                    username: userModel.username,
                    password: userModel.password,
                    nickname: userModel.nickname,
                    sort: userModel.sort,
                    creator: userModel.creator,
                    editor: userModel.editor,
                    created_time: userModel.created_time,
                    modified_time: userModel.modified_time,
                    status: status.enable,
                    is_delete: isDelete.false,
                }
            }),
            prisma.UserRole.create({
                data:{
                    id:randomUUID(),
                    user_id:userModel.id,
                    role_id:roleId.普通用户,
                    status: status.enable,
                    is_delete: isDelete.false,
                }
            }),
            prisma.ng_email.updateMany({
                where:{
                    code:validateCode
                },
                data:{
                    status:status.disable
                }
            })
        ])
        return res
    }

    async validateCode(emailQuery){
        emailQuery.expire_time = {
            gt: new Date(),
        }
        const queryRes = await this.emailService.queryEmail(new PaginationModel({pageNumber:1,pageSize:1}),new OrderByModel({}),emailQuery)
        return queryRes[1].length>0?queryRes[1][0]:null
    }

    async changePwd(userModel,validateCode){
        const res = await prisma.$transaction([
            prisma.OAuthUsers.update({
                where: {
                    id: userModel.id
                },
                data: {
                    password: userModel.password,
                    modified_time: new Date(),
                }
            }),
            prisma.ng_email.updateMany({
                where:{
                    code:validateCode
                },
                data:{
                    status:status.disable
                }
            })
        ])
        return res
    }

    async detail(userId){
        return await prisma.OAuthUsers.findUnique({
            where:{
                id:userId
            }
        })
    }

    async query(pagination, orderBy, oauthUsersModel){
        const where = [
            oauthUsersModel.pay_time_start && `a.created_time >= '${oauthUsersModel.created_time_start}'`,
            oauthUsersModel.pay_time_end && `a.created_time <= '${oauthUsersModel.created_time_end}'`,
            oauthUsersModel.username && `a.username like '%${oauthUsersModel.username}%'`,
            !isNullOrUndefined(oauthUsersModel.status) && `a.status='${oauthUsersModel.status}'`,
            !isNullOrUndefined(oauthUsersModel.is_delete) && `a.is_delete='${oauthUsersModel.is_delete}'`
        ].filter(c => c).join(' and ')

        const totalSql =   `
        select count(*) _all from oauth_users a
        left join oauth_user_role b on a.id=b.user_id
        left join oauth_role c on c.id = b.role_id
        ${where ? `where ${where}` : ''} `

        const querySql = `
        select a.id,c.id as role_id,a.username,a.created_time,c.name as role_name,a.nickname,count(distinct d.id) web_count,count(distinct e.id) service_count,a.is_delete,a.status from oauth_users a
        left join oauth_user_role b on a.id=b.user_id
        left join oauth_role c on c.id = b.role_id
        left join ng_tunnel_web d on a.id=d.creator and d.is_delete=0 and d.status=1
        left join ng_tunnel_service e on a.id=e.creator and e.is_delete=0 and e.status=1
        ${where ? `where ${where}` : ''}
        group by a.id,role_id,a.username,a.created_time,role_name,a.nickname,a.is_delete,a.status
        order by a.sort asc,a.created_time desc
        limit ${(pagination.pageNumber - 1) * pagination.pageSize},${pagination.pageSize}
        `
        let totalRes = await prisma.$queryRaw(Prisma.raw(totalSql))
        let recordRes = await prisma.$queryRaw(Prisma.raw(querySql))
        return [totalRes[0]._all,recordRes]
    }

    editUser(userModel) {
        return prisma.OAuthUsers.update({where: {id: userModel.id}, data: userModel});
    }

    createUser(userModel) {
        userModel.id = randomUUID()
        return prisma.$transaction([
            prisma.OAuthUsers.create({
                data: {
                    id: userModel.id,
                    username: userModel.username,
                    password: userModel.password,
                    nickname: userModel.nickname,
                    sort: userModel.sort,
                    creator: userModel.creator,
                    editor: userModel.editor,
                    created_time: userModel.created_time,
                    modified_time: userModel.modified_time,
                    status: status.enable,
                    is_delete: isDelete.false,
                }
            }),
            prisma.UserRole.create({
                data:{
                    id:randomUUID(),
                    user_id:userModel.id,
                    role_id:roleId.普通用户,
                    status: status.enable,
                    is_delete: isDelete.false,
                }
            })
        ])
    }

    delUser(ids,isPhysics=false){
        if(isPhysics){
            return prisma.$transaction([
                prisma.UserRole.deleteMany({where:{user_id:{in:ids}}}),
                prisma.OAuthUsers.deleteMany({where:{id:{in:ids}}})
            ])
        }else{
            return prisma.$transaction([
                prisma.UserRole.updateMany({data:{is_delete: isDelete.true,}, where:{user_id:{in:ids}}}),
                prisma.OAuthUsers.updateMany({data: {is_delete: isDelete.true,}, where: {id:{in:ids}}}),
            ])
        }
    }
}
