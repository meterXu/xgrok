import dotenv from 'dotenv'
import path from 'path'

dotenv.config({
    path: path.resolve(`.env.${(process.env.NODE_ENV||'development').trim()}`)
})

export default {
    NODE_ENV:process.env.NODE_ENV||'development',
    port:process.env.port||11525,
    enableSsl:process.env.enableSsl!=='false',
    ssl_key:process.env.ssl_key||null,
    ssl_cert:process.env.ssl_cert||null,
    authIgnores:[
        '/web'
        ,'/swagger-html'
        ,'/api/swagger-html'
        ,'/api/swagger-json'
        ,'/api/gateway'
        ,'/api/gateway/notify'
        ,'/api/redirect'
        ,'/api/server/checkServerOnline'
        ,'/oauth/authorize'
        ,'/oauth/swagger-html'
        ,'/oauth/swagger-json'
        ,'/oauth/sendValidateCode'
        ,'/oauth/register'
        ,'/oauth/validateCode'
        ,'/oauth/checkUserIsExist'
        ,'/oauth/changePwd'
    ],
    logIgnores:['/api/server/checkServerOnline'],
    grants:['password'],
    accessTokenExpiresTime:3600*24*7*1000, //有效期7天
    refreshTokenExpiresTime:3600*24*14*1000, //有效期14天
    send_mail_user:process.env.send_mail_user||null,
    send_mail_password:process.env.send_mail_password||null,
    send_mail_from:process.env.send_mail_from||null,
    alipay_appId:process.env.alipay_appId||null,
    alipay_gateway:process.env.alipay_gateway||null,
    notify_url:process.env.notify_url||null,
    resend:process.env.resend||null,
    timestampDiff:process.env.timestampDiff||86400,//24H
}
