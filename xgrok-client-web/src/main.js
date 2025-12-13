import Koa from 'koa';
import config from './config.js'
import {apiRouter} from './router/index.js'
import koaBody from 'koa-body'
import cors from 'koa2-cors'
import koaStatic from 'koa-static'
import http from 'http'
import routerResponse from "./middleware/routerResponse.js";
import path from "path";

global.appConfig = config
BigInt.prototype.toJSON = function() {
    return Number(this)
}
let server = null
const app = new Koa()
app.use(koaBody({multipart: true}));
app.use(cors());
app.use(koaStatic(path.resolve('web')))
    .use(routerResponse())
    .use(apiRouter.routes())
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
process.on('uncaughtException', ex => {
    console.error('uncaughtException\n',ex,(ex&&ex.stack));
})
process.on('unhandledRejection', ex=> {
    console.error('unhandledRejection\n',ex,(ex&&ex.stack));
})

