import {swaggerClass} from "koa-swagger-decorator";

@swaggerClass()
export default class AlipayNotifyModel{
    constructor(body) {
        Object.entries(body).forEach(c=>{
            this[c[0]]=c[1]
        })
    }

    isSignPass(){
        return global.alipaySdk.checkNotifySignV2(this)
    }

}