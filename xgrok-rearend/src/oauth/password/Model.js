import OAuthUsersService from "../../service/oauthUsersService.js";
import OAuthClientsService from "../../service/oauthClientsService.js";
import OAuthTokensService from "../../service/oauthTokensService.js";
import {randomUUID} from "../../utils/index.js";
import config from "../../config.js";
import {OAuthError} from "oauth2-server";
import md5 from 'js-md5'

export default class Model {
    constructor(ctx) {
        if(!this.oauthUsersService){
            this.oauthUsersService = new OAuthUsersService()
        }
        if(!this.oauthClientsService){
            this.oauthClientsService = new OAuthClientsService()
        }
        if(!this.oauthTokensService){
            this.oauthTokensService = new OAuthTokensService()
        }
        this.ctx=ctx
    }

    static createNewToken(type='accessToken'){
        return {
            value:randomUUID(true),
            expiresTime:new Date(new Date().valueOf()+(type==='accessToken'?config.accessTokenExpiresTime:config.refreshTokenExpiresTime))
        }
    }

    async getUser(username, password){
        let res = await this.oauthUsersService.queryOAuthUsers({
            username:username,
            password:password
        })
        if(!res){
            throw new OAuthError('账号或密码错误！')
        }
        return res

    }
    async getClient(clientId, clientSecret){
        let res = await this.oauthClientsService.queryOAuthClients({
            client_id:clientId,
            client_secret:clientSecret
        })
        if(!res){
            throw new OAuthError('client id或secret错误！')
        }
        return res
    }
    async saveToken(token, client, user) {
        const _accessToken = {
            accessToken: token.accessToken.value,
            accessTokenExpiresAt: token.accessToken.expiresTime,
            client:client,
            refreshToken: token.refreshToken.value,
            refreshTokenExpiresAt: token.refreshToken.expiresTime,
            user: user
        };
        await this.oauthTokensService.createOrUpdateOAuthToken(_accessToken)
        return _accessToken;
    }
    async generateAccessToken(client, user, scope){
        let _token = await this.oauthTokensService.queryOAuthToken({
            client_id:client.id,
            user_id:user.id
        })
        if(_token){
            const newToken = Model.createNewToken('accessToken')
            _token.accessTokenExpiresAt = newToken.expiresTime
            if(_token.accessTokenExpiresAt.valueOf()<new Date().valueOf()){
                _token.accessToken = newToken.value
            }
            return  {
                value:_token.accessToken,
                expiresTime:_token.accessTokenExpiresAt
            }
        }else{
            return Model.createNewToken()
        }
    }
    async generateRefreshToken(client, user, scope){
        let _token = await this.oauthTokensService.queryOAuthToken({
            client_id:client.id,
            user_id:user.id
        })
        if(_token){
            const newToken = Model.createNewToken('refreshToken')
            _token.refreshTokenExpiresAt = newToken.expiresTime
            if(_token.refreshTokenExpiresAt.valueOf()<new Date().valueOf()){
                _token.refreshToken = newToken.value
            }
            return {
                value:_token.refreshToken,
                expiresTime:_token.refreshTokenExpiresAt
            }
        } else{
            return Model.createNewToken()
        }
    }
    async getAccessToken(accessToken){
        let encryptToken = accessToken
        let realToken = this.ctx.headers['x-access-token']
        let time = this.ctx.headers['x-access-time']
        if(this.validateToken(encryptToken,realToken,time)){
            let _accessToken = await this.oauthTokensService.queryOAuthToken({
                access_token:process.env.NODE_ENV==='development'?accessToken:realToken
            })
            return _accessToken;
        }else{
            return null
        }
    }
    async validateScope(user, client, scope){
        return {
            scope:scope
        };
    }
    validateToken(encryptToken,realToken,time){
        if(process.env.NODE_ENV==='development'){
            return true
        }
        if(new Date().valueOf()-parseInt(time)>config.timestampDiff){
            return false
        }else {
            return md5([realToken,time,'isaacxu'].join(' '))===encryptToken
        }
    }
}

export const passwordModel =Model