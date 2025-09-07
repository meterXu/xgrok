import {defaultPort, httpType, payPlan} from "@/libs/enums";
import {ElMessageBox} from "element-plus";

export function useMyTitle(tunnelConfig){
    return tunnelConfig.remark?`${tunnelConfig.name}：${tunnelConfig.remark}`:tunnelConfig.name
}

export function testName(value){
    return /^[a-zA-Z0-9_-]+$/gi.test(value)
}

export function testUrl(urlStr){
    return /^(https?:\/\/)?([a-zA-Z0-9.-]+)(:\d+)?(\/[^\s]*)?$/.test(urlStr)
}

export function deviceType() {
    const ua = window.navigator.userAgent.toLowerCase()
    if(/mac os/i.test(ua)){
        return 'darwin'
    } else {
        return 'win32'
    }
}


export const usePayPlanColor=function (_payPlan){
    switch (_payPlan){
        case payPlan.vip:{
            return 'warning'
        }
        case payPlan.free:
        default:{
            return 'success'
        }
    }
}

export function confirm(msg,title,options){
    return ElMessageBox.confirm(msg, title,Object.assign({
        customClass:'my-messageBox-confirm',
        buttonSize:'default',
        closeOnClickModal:false,
        showClose:false,
        center:true,
        confirmButtonClass:`el-button--success is-plain`,
        confirmButtonText:'确定',
        cancelButtonClass:`el-button--info is-plain`,
        cancelButtonText:'取消'
    },options))
}

export function alert(msg,title,options){
    ElMessageBox.alert(msg, title,Object.assign({
        customClass:'my-messageBox-alert',
        confirmButtonText: '确定',
        showClose:false,
        center:true,
        closeOnClickModal:false,
        confirmButtonClass:'el-button--info is-plain',
        buttonSize:'default'
    },options))
}

export function getUrlSchema(urlString){
    try{
        if(testUrl(urlString)){
            const url = new URL(urlString);
            let protocol = url.protocol === 'http:'?httpType.http:httpType.https
            return {
                protocol:protocol,
                port:url.port||(protocol===httpType.http?defaultPort.http:defaultPort.https)
            }
        }else{
            return null
        }
    }catch (err){
        return null
    }
}

export function isLocalHost(host){
    return /^((http|https):\/\/)?(127.0.0.1|localhost)/.test(host)
}

export function resetObj(obj, defaultValue) {
    Object.keys(obj).forEach(key => {
        if (obj[key] instanceof Array) {
            obj[key] = []
        } else {
            obj[key] = null
        }
    })
    Object.assign(obj, defaultValue)
}

export const $ss = {
    get(key){
        return sessionStorage.getItem(`${window.project.namespace}__${key}`)
    },
    set(key,value){
        sessionStorage.setItem(`${window.project.namespace}__${key}`,value)
    }
}
