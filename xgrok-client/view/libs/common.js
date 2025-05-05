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
    return ElMessageBox.confirm(msg, title,{
        customClass:'my-messageBox-confirm',
        buttonSize:'default',
        closeOnClickModal:false,
        showClose:false,
        confirmButtonClass:`el-button--info is-plain my-info-btn no-border ${options.confirmButtonClass}`,
        confirmButtonText:options.confirmButtonText||'确定',
        cancelButtonClass:`el-button--info is-plain my-info-btn no-border ${options.cancelButtonClass}`,
        cancelButtonText:options.cancelButtonText||'取消'
    })
}

export function alert(msg,title,options){
    ElMessageBox.alert(msg, title,Object.assign({
        customClass:'my-messageBox-alert',
        confirmButtonText: '确定',
        showClose:false,
        center:true,
        closeOnClickModal:false,
        confirmButtonClass:'el-button--info is-plain my-info-btn no-border',
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

export const $ss = {
    get(key){
        return sessionStorage.getItem(`${window.project.namespace}__${key}`)
    },
    set(key,value){
        sessionStorage.setItem(`${window.project.namespace}__${key}`,value)
    }
}

Function.prototype.debounce=function (delay=500){
    const originalFunction = this;
    let timeoutId = window.debounceTimeoutId;
    return function (...args) {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        return new Promise((resolve, reject) => {
            window.debounceTimeoutId = setTimeout(async () => {
                try{
                    let res = await originalFunction.apply(this, args);
                    resolve(res);
                }catch (err){
                    reject(err);
                }
            }, delay);
        })

    };
}

export function sleep(time=100){
    return new Promise(resolve => {
        setTimeout(()=>{
            resolve(time)
        },time)
    })
}