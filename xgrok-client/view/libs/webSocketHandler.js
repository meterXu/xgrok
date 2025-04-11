import {useAppStore} from "@/store";
import {queryPayPlan} from "@/api";
import {alert} from "@/libs/common";
import {payPlan} from "@/libs/enums";

export default async function (data){
    switch (data.type){
        case 'order':{
            orderAction(data)
        }break
        case 'heartbeatToken':{
            heartbeatToken(data)
        }break
        case 'planExpired':{
            await planExpired(data)
        }break
    }

}
function orderAction(data){
    const store = useAppStore()
    if(data.isPaySuccess||data.isRefundSuccess){
        queryPayPlan().then(res=>{
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
    if(store.plan.value!==payPlan.free){
        alert('你的订阅已过期')
    }
    if(store.pid.value){
        await window.electronAPI.turnOff(store.pid.value)
        store.setPid(null)
    }
    store.setPlan(data.plan)

}