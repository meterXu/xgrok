import {createService,onResponseError} from 'xxweb-util/lib/request.js'
import { dealWithError } from './dealwithError.js';
import {appStore} from "@/store/index.js";
import {ACCESS_TOKEN} from 'xxweb-util/lib/types.js'
import md5 from "js-md5";
const axios = createService(window.project.variable.baseApi,(config:any)=>{
  const token = window.$ls.get(ACCESS_TOKEN)
  if(token){
    const time = new Date().valueOf()
    if(process.env.NODE_ENV==='development'){
      config.headers[window.project.variable.tokenKey] = token
    }else{
      config.headers[window.project.variable.tokenKey] = token.split(' ')[0] +' '+ md5([token.split(' ')[1],time,'isaacxu'].join(' '));
      config.headers['X-Access-Token'] = token.split(' ')[1];
      config.headers['X-Access-Time'] = time;
    }
  }
  return {
    tokenKey:window.project.variable.tokenKey,
    token:appStore().token?.value
  }
})
onResponseError(axios,(error:any) => dealWithError(error))
axios.interceptors.response.use((response:any) => {
  return response ? response.data : {}
})

export function postAction(url:string, parameter:any,headers?:any) {
  return axios({
    url: url,
    method: "post",
    data: parameter,
    headers:headers
  })
}

export function putAction(url:string, parameter:any) {
  return axios({
    url: url,
    method: "put",
    data: parameter
  })
}

export function getAction(url:string, parameter:any) {
  return axios({
    url: url,
    method: "get",
    params: parameter
  })
}

export function deleteAction(url:string, parameter:any) {
  return axios({
    url: url,
    method: "delete",
    params: parameter
  })
}

export function downFile(url:string, parameter:any) {
  return axios({
    url: url,
    params: parameter,
    method: "get",
    responseType: "blob"
  })
}
