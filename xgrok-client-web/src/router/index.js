import {SwaggerRouter} from 'koa-swagger-decorator'
import { fileURLToPath } from 'url';
import { dirname,resolve } from 'path';

const apiRouter = new SwaggerRouter({
    prefix: '/api',
})

let routers = []
routers.push(apiRouter)

routers.forEach(_router=>{
    _router.swagger({
        title: 'xgrok web client',
        description: 'API DOC',
        version: '1.0.1',
        swaggerHtmlEndpoint: '/swagger-html',
        swaggerJsonEndpoint: '/swagger-json',
    })
})
// 获取当前模块的目录名
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

apiRouter.mapDir(resolve(__dirname, '../controller/'))

export {apiRouter}
