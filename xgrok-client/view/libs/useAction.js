import {computed, reactive} from "vue";
import router from "@/router";
import {clientType, NotificationType, payPlan} from "@/libs/enums";
import {confirm} from "@/libs/common";
import {useAppStore} from '@/store'
import {showNotification} from "@/libs/message";

export function useGetValidateRes(form){
    const obj={}
    Object.keys(form).forEach(key=>{
        obj[key]={value:null,valid:!!form[key]}
    })
    return reactive(obj)
}

export function useGetErrorMsg(validateRes){
    return computed(()=>{
        return Object.entries(validateRes).map(c=>{
            return c[1].value
        }).filter(c=>c)
    })
}

export function useGetDisabled(validateRes){
    return computed(()=>{
        return Object.entries(validateRes).some(c=>c[1].valid===false)
    })
}

export function onFormValidate(validateRes,validObj){
    validateRes[validObj.prop].valid = validObj.valid
    validateRes[validObj.prop].value = validObj.value
}

export function resetFormValidate(validateRes){
    Object.entries(validateRes).forEach(([key,value])=>{
        validateRes[key].value = null
    })
}

export function useGetTermsOfServiceUrl(){
    return window.project.variable.website+'termsOfService.html'
}
export function usePrivacyAgreementUrl(){
    return window.project.variable.website+'privacyAgreement.html'
}

export async function useGoBack(){
    router.back()
}

export async function useGoTo(name,isReplace=false){
    const store = useAppStore()
    store.setHeaderBtnLoading(true)
    isReplace? await router.replace({name}):await router.push({name})
    store.setHeaderBtnLoading(false)
}

export function checkTunnelConfig(selectedServer,web,service){
    const store = useAppStore()
    let res = selectedServer && (web.length > 0 || service.length > 0)
    if(!res){
        showNotification(NotificationType.warning,'请先添加一个隧道再启动服务！')
    }
    if(store.plan.value===payPlan.free){
        if(service.length>1){
            gotoSubscribe('抱歉！免费计划用户只能添加一个服务隧道！')
            res = false
        } else if(web.length>1){
            gotoSubscribe('抱歉！免费计划用户只能添加一个网页隧道！')
            res = false
        }
    }
    return res
}

export function checkPermission(tunnelType,tunnelConfigs=[]){
    const store = useAppStore()
    if(store.plan.value===payPlan.free){
        if(tunnelType==='service'&&tunnelConfigs.length>=1){
            gotoSubscribe('抱歉！免费计划用户只能添加一个服务隧道！')
            return false
        }if(tunnelType==='web'&&tunnelConfigs.length>=1){
            gotoSubscribe('抱歉！不捐赠用户只能添加一个网页隧道！')
            return false
        }
        return true
    } else{
        return true
    }
}

export function gotoSubscribe(message){
    confirm(message, null,{
        confirmButtonText:'去捐赠',
        cancelButtonText:'知道了',
        confirmButtonClass:'el-button--warning is-plain'
    }).then(()=>{
        router.push({name:'Plan'})
    }).catch(()=>{})
}

export function operationConfirm(){
    const {pid} = useAppStore()
    if(pid.value){
        return confirm('服务正在运中，是否继续操作？','',{
            confirmButtonText: '继续',
            cancelButtonText: '取消',
        })
    }else{
        return Promise.resolve()
    }
}

export function useClientType(){
    return ref(window.project.variable.mode)
}

export function useClientTypeExecute(browserAction,electronAction){
    if(window.project.variable.mode===clientType.browser){
        return browserAction&&browserAction()
    }else{
        return electronAction&&electronAction()
    }
}
