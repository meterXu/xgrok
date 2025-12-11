export default class Model {
    constructor(ctx) {
        this.ctx=ctx
    }
    async getAccessToken(accessToken){
        let encryptToken = accessToken
        let realToken = this.ctx.headers['x-access-token']
        let time = this.ctx.headers['x-access-time']
        if(this.validateToken(encryptToken,realToken,time)){
            let _accessToken = await this.oauthTokensService.queryOAuthToken({
                access_token:process.env.NODE_ENV==='development'?accessToken:realToken
            })
            if(_accessToken){
                _accessToken.accessTokenExpiresAt = new Date(Number(_accessToken.accessTokenExpiresAt))
                _accessToken.refreshTokenExpiresAt = new Date(Number(_accessToken.refreshTokenExpiresAt))
                return _accessToken;
            }else{
                return null
            }
        }else{
            return null
        }
    }
    validateToken(encryptToken,realToken,time){
        return true
    }
}

export const passwordModel =Model
