import {useAppStore} from "@/store";
import {queryPayPlan, queryServersConfig, serviceTurnOff} from "@/api";
import {alert} from "@/libs/common";
import {payType} from "@/libs/enums";
import {useClientTypeExecute} from "@/libs/useAction";

export default async function (data){
    switch (data.type){
        case 'order':{
            orderAction(data)
        }break
        case 'checkPlanExpired':{
            await planExpired(data)
        }break
        case 'notify':{
            alert(data.message,data.title)
        }
    }

}
function orderAction(data){
    const store = useAppStore()
    if(data.isPaySuccess||data.isRefundSuccess){
        queryPayPlan().then(res=>{// 订单有变，查询付款状态
            if(res.success){
                store.setPlan(res.data)
                store.setOrderStatus(data.orderId,data.isPaySuccess)
            }
        })
    }
}
async function planExpired(data){
    const store = useAppStore()
    queryPayPlan().then(async res=>{
        if(res.success){
            store.setPlan(res.data)
            if(res.data.plan.type===payType.free){// 真过期了
                if(store.pid){
                    const res = await useClientTypeExecute(()=>{
                        return serviceTurnOff({pid:store.pid})
                    },()=>{
                        return  window.electronAPI.turnOff(store.pid)
                    })
                    if(res.success){
                        store.setPid(null)
                        store.setConfigIsLock(false)
                        queryServersConfig(window.project.variable.type).then(res => {
                            store.setSelectedServer(res.data.records[0])
                        })
                    }
                }
                alert('你的捐赠已失效','')
            }
        }
    })

}
