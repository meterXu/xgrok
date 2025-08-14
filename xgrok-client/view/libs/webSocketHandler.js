import {useAppStore} from "@/store";
import {queryPayPlan} from "@/api";
import {alert} from "@/libs/common";
import {payType} from "@/libs/enums";

export default async function (data){
    switch (data.type){
        case 'order':{
            orderAction(data)
        }break
        case 'heartbeatToken':{
            heartbeatToken(data)
        }break
        case 'checkPlanExpired':{
            await planExpired(data)
        }break
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
function heartbeatToken(data){
    const store = useAppStore()
    store.setToken(data.access_token)
}
async function planExpired(data){
    const store = useAppStore()
    queryPayPlan().then(async res=>{
        if(res.success){
            store.setPlan(res.data)
            if(res.data.plan.type===payType.free){// 真过期了
                if(store.pid.value){
                    await window.electronAPI.turnOff(store.pid.value)
                    store.setPid(null)
                }
                alert('你的订阅已过期')
            }
        }
    })

}