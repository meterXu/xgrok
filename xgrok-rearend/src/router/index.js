import {SwaggerRouter} from 'koa-swagger-decorator'
import path from "path";

const oAuthRouter = new SwaggerRouter({
    prefix: '/oauth'
})

const apiRouter = new SwaggerRouter({
    prefix: '/api',
})

let routers = []
routers.push(oAuthRouter)
routers.push(apiRouter)

routers.forEach(_router=>{
    _router.swagger({
        title: 'xgrok Server',
        description: 'API DOC',
        version: '1.0.1',
        swaggerHtmlEndpoint: '/swagger-html',
        swaggerJsonEndpoint: '/swagger-json',
    })
})

apiRouter.mapDir(path.resolve(__dirname, '../controller/'))

oAuthRouter.mapDir(path.resolve(__dirname, '../oauth/controller/'))

export {apiRouter,oAuthRouter}
