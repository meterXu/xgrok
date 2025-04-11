import OAuthUsersService from './oauthUsersService.js'
import {Request, Response} from "oauth2-server";
import OAuthClientsService from "./oauthClientsService.js";
import OAuthTokensService from "./oauthTokensService.js";
import md5 from 'js-md5'
import ResultModel from "../model/sys/resultModel.js";
import Model from "../oauth/password/Model.js";
import config from '../config.js'

export default class OAuthService{
    constructor() {
        if(!this.oauthUsersService){
            this.oauthUsersService = new OAuthUsersService()
        }
        if(!this.oauthClientsService){
            this.oauthClientsService = new OAuthClientsService()
        }
        if(!this.oauthTokensService){
            this.oauthTokensService = new OAuthTokensService()
        }
    }

    async getToken(ctx){
        let request = new Request(ctx.request);
        let response = new Response(ctx.response);
        const type = ctx.request.body.type
        let token = await ctx.oauth.token(request, response);
        if(type){
            if(token.user.type===parseInt(type))
                return token
            else{
                return null
            }
        }
        else{
            return token
        }
    }

    async refreshToken(ctx){
        let token = await this.oauthTokensService.queryOAuthToken(ctx.request.body)
        if(token&&token.refreshTokenExpiresAt.valueOf() >= new Date().valueOf()){
            let accessToken = Model.createNewToken()
            let refreshToken  = Model.createNewToken()
            token.accessToken = accessToken.value
            token.refreshToken = refreshToken.value
            token.accessTokenExpiresAt  = accessToken.expiresTime
            token.refreshTokenExpiresAt  = refreshToken.expiresTime
            await this.oauthTokensService.createOrUpdateOAuthToken(token)
            return token
        }else{
            return null
        }

    }
    compareSignature(ctx){
        const {password,client_secret,timestamp,signature} = ctx.request.body
        if(Math.abs(new Date().valueOf()-parseInt(timestamp))> config.timestampDiff){
            return new ResultModel(null,'timestamp超时！',false,500)
        }else{
            const _signature = md5(password+client_secret+timestamp)
            if(_signature!==signature){
                return new ResultModel(null,'signature鉴权错误！',false,500)
            }else{
                return new ResultModel(null,null,true,200)
            }
        }

    }

}

