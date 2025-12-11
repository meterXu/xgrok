import {swaggerClass, swaggerProperty} from "koa-swagger-decorator";

@swaggerClass()
export default class OrderByModel {
    constructor(query) {
        if(query.orderBy){
            const _orderBy = JSON.parse(query.orderBy)
            return _orderBy.map(c=>{
                const res = {}
                Object.entries(c).forEach(c=>{
                    res[c[0]] = c[1]
                })
                return res
            })
        }else{
            return [{"sort":"asc"},{"created_time":"desc"}]
        }
    }
    @swaggerProperty({ type: "string",description:"排序",nullable:false,default:'[{"sort":"asc"},{"created_time":"desc"}]'}) orderBy='[{"sort":"asc"},{"created_time":"desc"}]'//设置默认值
}
