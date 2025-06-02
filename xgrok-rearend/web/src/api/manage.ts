import {createService,onResponseError} from 'xxweb-util/lib/request.js'
import { dealWithError } from './dealwithError.js';
import {appStore} from "@/store/index.js";
const axios = createService(window.project.variable.baseApi,()=>{
  return {
    tokenKey:window.project.variable.tokenKey,
    token:appStore().token?.value
  }
})
onResponseError(axios,(error:any) => dealWithError(error))
axios.interceptors.response.use((response:any) => {
  return response ? response.data : {}
})

export function postAction(url:string, parameter:any,headers:any) {
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