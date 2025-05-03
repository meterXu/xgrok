import Koa from 'koa';
import fs from 'fs'
import config from './config.js'
import {apiRouter,oAuthRouter} from './router/index.js'
import koaBody from 'koa-body'
import cors from 'koa2-cors'
import koaStatic from 'koa-static'
import http from 'http'
import https from 'https'
import routerResponse from "./middleware/routerResponse.js";
import path from "path";
import { Worker} from 'worker_threads';
import webSocket from "./middleware/webSocket.js";
import MainThreadWorker from './works/mainThread'
import {getAlipaySdk,initLog} from "./utils/index.js";

BigInt.prototype.toJSON = function() {
    return Number(this)
}
global.alipaySdk = getAlipaySdk()
initLog()

let server = null
let sslOptions = null;
const app = new Koa()
app.use(koaBody({multipart: true}));
app.use(cors());
app.use(koaStatic(path.resolve('static')))
    .use(routerResponse())
    .use(oAuthRouter.routes())
    .use(apiRouter.routes())
if(config.enableSsl){
    try{
        sslOptions = {
            key: fs.readFileSync(config.ssl_key),  //ssl文件路径
            cert: fs.readFileSync(config.ssl_cert)  //ssl文件路径
        };
        server = https.createServer(sslOptions, app.callback()).listen(config.port,(err)=>{
            if(!!err){
                console.error('HTTPS server FAIL: ', err, (err && err.stack));
            }else{
                console.log(`service started at ${config.NODE_ENV} https://localhost:${config.port}`);
            }
        });
    }catch (ex) {
        console.error('Failed to start HTTPS server\n', ex, (ex && ex.stack));
    }
}
else{
    try{
        server = http.createServer(app.callback()).listen(config.port,(err)=>{
            if(!!err){
                console.error('HTTP server FAIL: ', err, (err && err.stack));
            }else{
                console.log(`service started at ${config.NODE_ENV} http://localhost:${config.port}`);
            }
        });
    }catch (ex) {
        console.error('Failed to start HTTP server\n', ex, (ex && ex.stack));
    }
}

global.webSocket = new webSocket()
server&&global.webSocket.init(server)
global.heartBeatWorker =  new Worker(path.resolve(__dirname, 'works/childThread.js'))
new MainThreadWorker()
