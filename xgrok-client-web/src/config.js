import dotenv from 'dotenv'
import path from 'path'
import os from "node:os";

dotenv.config({
    path: path.resolve(`.env.${(process.env.NODE_ENV||'development').trim()}`)
})

export default {
    NODE_ENV:process.env.NODE_ENV||'development',
    port:process.env.port||8181,
    enableSsl:process.env.enableSsl!=='false',
    ssl_key:process.env.ssl_key||null,
    ssl_cert:process.env.ssl_cert||null,
    authIgnores:[
        '/'
        ,'/swagger-html'
        ,'/api/swagger-html'
        ,'/api/swagger-json'
        ,'/api/*'
    ],
    logIgnores:[],
    grants:['password'],
    accessTokenExpiresTime:3600*24*7*1000, //有效期7天
    refreshTokenExpiresTime:3600*24*14*1000, //有效期14天
    timestampDiff:process.env.timestampDiff||86400,//24H
    clientRootPath:path.resolve(path.join('execute',os.platform())),
    xgrokCoreCfgPath:path.resolve('.xgrok.cfg'),
    logPath:path.resolve('.xgrok-core.log'),
    xgrokAppCfgPath:path.resolve(`.xgrokApp.json`),
    serverPort:4446,
    startWebServerProt:7400,
    auth:{
        method:'token',
        token:'xgrok_84hG5!Jk9m',
    },
    webServer:{
        addr:'127.0.0.1',
        port:7400,
        user:'xgrok',
        password:'xgrok'
    },
    appConf:{
        theme: 'system',
        autoServer:false,
        proxy: ''
    }
}
