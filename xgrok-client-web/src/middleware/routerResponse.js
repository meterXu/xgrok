import ResultModel from "../model/sys/resultModel.js";
import {Request, Response} from "oauth2-server";
import OAuth2 from "oauth2-server";
import {passwordModel} from "../oauth/password/Model.js";
import config from "../config.js";

export default function (){
    return async function(ctx,next){
        ctx.oauth = new OAuth2({
            grants: ['password'],
            model: new passwordModel(ctx),
            accessTokenLifetime: 4 * 60 * 60
        });
        ctx.result = function (result){
            result.success?ctx.success(result):ctx.fail(result)
        }
        // 通过success区分业务服务成功或失败，状态码都是200
        ctx.success = function (result) {
            ctx.response.body = ctx.response.body||'json'
            if(!result.code) result.code = 200
            if(!result.success) result.success = true
            if(!result.message) result.message = '请求成功！'
            ctx.body = result
            if(!config.logIgnores.some(c=>c===ctx.request.path)){
                global.logger.info(`ctx.body: ${JSON.stringify(ctx.body)}`)
            }
        }

        ctx.fail = function (result) {
            ctx.response.body = ctx.response.body||'json'
            if(!result.code) result.code = 200
            if(!result.success) result.success = false
            if(!result.message) result.message = '请求失败！'
            ctx.body = Object.assign(result)
            ctx.status = result.code;
            if(!config.logIgnores.some(c=>c===ctx.request.path)){
                global.logger.error(`ctx.body: ${JSON.stringify(ctx.body)}`)
            }
        }
        try{
            ctx.set('Access-Control-Allow-Origin', '*')
            ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
            ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS')
            ctx.set('Access-Control-Allow-Credentials', true) // 允许带上 cookie
            if(!config.logIgnores.some(c=>c===ctx.request.path)){
                global.logger.info(`request.originalUrl: ${JSON.stringify(ctx.request.originalUrl, null, null)}`)
                global.logger.info(`request.headers: ${JSON.stringify(JSON.stringify(ctx.request.headers, null, null))}`)
                global.logger.info(`request.query: ${JSON.stringify(ctx.request.query, null, null)}, request.body: ${JSON.stringify(ctx.request.body, null, null)}`)
            }
            if(config.authIgnores.some(c=>new RegExp(c).test(ctx.request.path))){
                await next();
            }else{
                const request = new Request(ctx.request);
                const response = new Response(ctx.response);
                ctx.token  = await ctx.oauth.authenticate(request, response);
                await next();
            }
        }catch (err){
            global.logger.error(err)
            // 全局服务异常，返回状态码500
            ctx.fail(new ResultModel(
                null,
                err?.meta?.cause||err?.message||'接口异常！',
                false,
                typeof(err.code)!=='number'?500:err.code))
        }
    }
}

