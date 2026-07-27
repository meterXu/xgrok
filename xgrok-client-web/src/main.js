import Koa from 'koa';
import config from './config.js'
import {apiRouter} from './router/index.js'
import koaBody from 'koa-body'
import cors from 'koa2-cors'
import koaStatic from 'koa-static'
import http from 'http'
import routerResponse from "./middleware/routerResponse.js";
import path from "path";

global.project = config
global.logger = {
  info: function (){console.log(`${new Date()} ${[...arguments].join(' ')}\r`)},
  warn: function(){console.warn(`${new Date()} ${[...arguments].join(' ')}\r`)},
  error: function(){console.error(`${new Date()} ${[...arguments].join(' ')}\r`)},
}
global.proxyLocalhost = '0.0.0.0'
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
            global.logger.error('HTTP server FAIL: ', err, (err && err.stack));
        }else{
            global.logger.info(`service started at ${config.NODE_ENV} http://localhost:${config.port}`);
        }
    });
}catch (ex) {
    global.logger.error('Failed to start HTTP server\n', ex, (ex && ex.stack));
}
process.on('uncaughtException', ex => {
    global.logger.error('uncaughtException\n',ex,(ex&&ex.stack));
})
process.on('unhandledRejection', ex=> {
    global.logger.error('unhandledRejection\n',ex,(ex&&ex.stack));
})

