import {getLocalDateTime, randomUUID} from "../utils/index.js";
import {isDelete,status} from "../utils/enum.js";
import OAuthTokensModel from "../model/oauthTokensModel.js";
const {Prisma,PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();

export default class OAuthTokensService {
    constructor() {
    }

    async queryOAuthToken(query) {
        const oauthTokensModel = new OAuthTokensModel(query)
        let where = [
            oauthTokensModel.access_token && `a.access_token = '${oauthTokensModel.access_token}'`,
            oauthTokensModel.refresh_token && `a.refresh_token = '${oauthTokensModel.refresh_token}'`,
            oauthTokensModel.refresh_token_expires_at && `a.refresh_token_expires_at >= '${oauthTokensModel.refresh_token_expires_at}'`,
            oauthTokensModel.user_id && `a.user_id = '${oauthTokensModel.user_id}'`,
            oauthTokensModel.client_id && `a.client_id = '${oauthTokensModel.client_id}'`
        ].filter(c => c).join(' and ')
        const querySql = `
        select 
        a.id,
        a.access_token,
        a.access_token_expires_at,
        a.refresh_token,
        a.refresh_token_expires_at,
        b.id userId,
        b.username,
        b.nickName,
        e.type,
        c.id clientId,
        c.client_id,
        c.client_secret
        from oauth_tokens a
        inner join oauth_users b on a.user_id = b.id and b.status=${status.enable} and b.is_delete=${isDelete.false}
        inner join oauth_clients c on a.client_id = c.id and c.status=${status.enable} and c.is_delete=${isDelete.false}
        inner join oauth_user_role d on d.user_id = b.id and d.status=${status.enable} and d.is_delete=${isDelete.false}
        inner join oauth_role e on e.id = d.role_id and e.status=${status.enable} and e.is_delete=${isDelete.false}
        ${where ? `where ${where}` : ''}
        `
        let recordRes = await prisma.$queryRaw(Prisma.raw(querySql))
        if(recordRes.length){
            return {
                id:recordRes[0].id,
                accessToken: recordRes[0].access_token,
                accessTokenExpiresAt: recordRes[0].access_token_expires_at,
                client:{
                    id:recordRes[0].clientId,
                    clientId:recordRes[0].client_id
                },
                refreshToken: recordRes[0].refresh_token,
                refreshTokenExpiresAt: recordRes[0].refresh_token_expires_at,
                user: {
                    id:recordRes[0].userId,
                    username:recordRes[0].username,
                    type:recordRes[0].type,
                }
            }
        }else{
            return null
        }
    }

    async createOrUpdateOAuthToken(oauthTokensModel) {
        const _token = await this.queryOAuthToken({
            user_id:oauthTokensModel.user.id,
            client_id:oauthTokensModel.client.id
        })
        if(_token){
            await prisma.OAuthTokens.update({
                where:{
                    id:_token.id
                },
                data:{
                    access_token:oauthTokensModel.accessToken,
                    access_token_expires_at:new Date(getLocalDateTime(oauthTokensModel.accessTokenExpiresAt)),
                    client_id:oauthTokensModel.client.id,
                    refresh_token:oauthTokensModel.refreshToken,
                    refresh_token_expires_at:new Date(getLocalDateTime(oauthTokensModel.refreshTokenExpiresAt)),
                    user_id:oauthTokensModel.user.id
                }
            })
            return _token
        }else{
            let res = await prisma.OAuthTokens.create({
                data:{
                    id:oauthTokensModel.id||randomUUID(),
                    access_token:oauthTokensModel.accessToken,
                    access_token_expires_at:new Date(getLocalDateTime(oauthTokensModel.accessTokenExpiresAt)),
                    client_id:oauthTokensModel.client.id,
                    refresh_token:oauthTokensModel.refreshToken,
                    refresh_token_expires_at:new Date(getLocalDateTime(oauthTokensModel.refreshTokenExpiresAt)),
                    user_id:oauthTokensModel.user.id
                }
            })
            return res
        }
    }

    async queryToken(pagination,orderBy,tokenQuery){
        const where = [
            tokenQuery.access_token_expires_at_start && `a.access_token_expires_at >= '${tokenQuery.access_token_expires_at_start}'`,
            tokenQuery.access_token_expires_at_end && `a.access_token_expires_at <= '${tokenQuery.access_token_expires_at_end}'`
        ].filter(c => c).join(' and ')
        const totalSql = `select count(*) _all from oauth_tokens a
                                 ${where ? `where ${where}` : ''} `
        const querySql = `
        select * from oauth_tokens a
        ${where ? `where ${where}` : ''}
        limit ${(pagination.pageNumber - 1) * pagination.pageSize},${pagination.pageSize}
        `
        let totalRes = await prisma.$queryRaw(Prisma.raw(totalSql))
        let recordRes = await prisma.$queryRaw(Prisma.raw(querySql))
        return [totalRes[0]._all,recordRes]
    }
    async delToken(id){
        return prisma.oAuthTokens.delete({
            where: {
                id: id
            }
        });
    }
}
