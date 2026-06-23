import {defaultPort, httpType, payPlan} from "@/libs/enums";
import {ElMessageBox} from "element-plus";
import {useAppStore} from "@/store";
import CryptoJS from 'crypto-js'

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
    ElMessageBox.close()
    return ElMessageBox.confirm(msg, title,Object.assign({
        customClass:'my-messageBox',
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
    ElMessageBox.close()
    ElMessageBox.alert(msg, title,Object.assign({
        customClass:'my-messageBox',
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
    return obj
}

export function getEnumKey(enumData, value) {
    let find = Object.entries(enumData).find(([key, _value]) => _value === value)
    return find ? find[0] : ''
}

export function getSystemTheme() {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    return mediaQuery?.matches ? 'dark' : 'light'
}

export function systemThemeChangeEvent(callback){
    callback&&(()=>{
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', (event)=>{
            callback(event?.matches ? 'dark' : 'light')
        });
    })()
}

export function getTheme(){
    const store = useAppStore()
    return store.appSetting.theme==='system'?store.systemTheme.value:store.appSetting.theme;
}

const key = CryptoJS.enc.Utf8.parse('xgrok00000000000');

export function encryptData(data) {
    const srcs = CryptoJS.enc.Utf8.parse(data);
    const encrypted = CryptoJS.AES.encrypt(srcs, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
}

export function decryptData(encryptedData) {
    const decrypted = CryptoJS.AES.decrypt(encryptedData, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
}
