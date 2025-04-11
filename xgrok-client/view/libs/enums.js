import {isEmpty} from "../../src/libs/common";

export const tunnelType={
    web:1,
    service:2
}

export const httpType={
    http:0,
    https:1
}

export const defaultPort={
    http:80,
    https:443
}

export const ServiceType={
    TCP:1,
    UDP:2
}

export const payPlan={
    free:0,
    vip:1,
}

export const payType={
    free:0,
    month:1,
    quarter:2,
    year:3
}

export const payStatus={
    unPayment:0, // 未交易
    paymentSuccess:1, //交易成成功
    paymentClose:2, //交易失败
    paymentRefund:3, // 退款
    paymentFinished:4 // 交易完成
}

export const useGetHttpText=function (_httpType){
    switch (_httpType){
        case httpType.http:{
            return '否'
        }
        case httpType.https:{
            return '是'
        }
    }
}

export const useServiceTypeText=function (_ServiceType){
    switch (_ServiceType){
        case ServiceType.TCP:{
            return 'TCP'
        }
        case ServiceType.UDP:{
            return 'UDP'
        }
    }
}
export function useEnumToList(_enum){
    return Object.entries(_enum).map(c=>{
        return {
            text:c[0],
            value:c[1]
        }
    })
}

export function useSysPayStatusToPayRes(sysPayStatus){
    switch (sysPayStatus){
        case payStatus.unPayment:{
            return null
        }
        case payStatus.paymentFinished:
        case payStatus.paymentSuccess:{
            return true
        }
        case payStatus.paymentRefund:
        case payStatus.paymentClose:{
            return false
        }
        default:{
            return null
        }
    }
}

export const isOnline={
    online:1,
    offline:0
}

export function useStatusClass(is_online){
    if(isEmpty(is_online)){
        return 'server-status-checking'
    }else{
        return is_online===isOnline.online?'server-status-icon-success':'server-status-icon-danger'
    }
}