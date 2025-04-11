import * as request from 'xxweb-box/utils/request'
import { dealWithError } from './dealwithError';
import {ACCESS_TOKEN} from "xxweb-box/utils/mutation-types";
import md5 from "js-md5"
const axios = request.getService(window.project)
const axiosSSO = request.getServiceSSO(window.project)
const axiosNoToken = request.getService(window.project,undefined,undefined,false)
const axiosSSONoToken = request.getServiceSSO(window.project,undefined,undefined,false)
axios.interceptors.request.use(config => {
  const token = window.app.config.globalProperties.$ls.get(ACCESS_TOKEN)
  if(token){
    const time = new Date().valueOf()
    if(import.meta.env.VITE_APP_mode==='browser'||import.meta.env.VITE_APP_mode==='development'){
      config.headers['Authorization'] = token
    }else{
      config.headers['Authorization'] = token.split(' ')[0] +' '+ md5([token.split(' ')[1],time,'isaacxu'].join(' '));
      config.headers['X-Access-Token'] = token.split(' ')[1];
      config.headers['X-Access-Time'] = time;
    }
  }
  return config
})
request.onResponseError(axios, (error) => dealWithError(error))
request.onResponseError(axiosNoToken, (error) => dealWithError(error))
request.onResponseError(axiosSSO, (error) => dealWithError(error))
request.onResponseError(axiosSSONoToken, (error) => dealWithError(error))
axios.interceptors.response.use((response) => {
  return response ? response.data : {}
})
axiosNoToken.interceptors.response.use((response) => {
  return response ? response.data : {}
})
axiosSSO.interceptors.response.use((response) => {
  return response ? response.data : {}
})
axiosSSONoToken.interceptors.response.use((response) => {
  return response ? response.data : {}
})
// post
export function postAction(url, parameter) {
  return axios({
    url: url,
    method: "post",
    data: parameter
  })
}
export function postActionNoToken(url, parameter) {
  return axiosNoToken({
    url: url,
    method: "post",
    data: parameter
  })
}

// post method= {post | put}
export function httpAction(url, parameter, method) {
  return axios({
    url: url,
    method: method,
    data: parameter
  })
}

// put
export function putAction(url, parameter) {
  return axios({
    url: url,
    method: "put",
    data: parameter
  })
}

// get
export function getAction(url, parameter) {
  return axios({
    url: url,
    method: "get",
    params: parameter
  })
}
export function getActionNoToken(url, parameter) {
  return axiosNoToken({
    url: url,
    method: "get",
    params: parameter
  })
}

// deleteAction
export function deleteAction(url, parameter) {
  return axios({
    url: url,
    method: "delete",
    params: parameter
  })
}

/**
 * 下载文件 用于excel导出
 * @param url
 * @param parameter
 * @returns {*}
 */
export function downFile(url, parameter) {
  return axios({
    url: url,
    params: parameter,
    method: "get",
    responseType: "blob"
  })
}

export function getActionSSONoToken(url, parameter) {
  return axiosSSONoToken({
    url: url,
    method: "get",
    params: parameter
  })
}

// post
export function postActionSSO(url, parameter) {
  return axiosSSO({
    url: url,
    method: "post",
    data: parameter
  })
}
export function postActionSSONoToken(url, parameter) {
  return axiosSSONoToken({
    url: url,
    method: "post",
    data: parameter
  })
}

// post method= {post | put}
export function httpActionSSO(url, parameter, method) {
  return axiosSSO({
    url: url,
    method: method,
    data: parameter
  })
}

// put
export function putActionSSO(url, parameter) {
  return axiosSSO({
    url: url,
    method: "put",
    data: parameter
  })
}

// get
export function getActionSSO(url, parameter) {
  return axiosSSO({
    url: url,
    method: "get",
    params: parameter
  })
}

// deleteAction
export function deleteActionSSO(url, parameter) {
  return axiosSSO({
    url: url,
    method: "delete",
    params: parameter
  })
}

/**
 * 下载文件 用于excel导出
 * @param url
 * @param parameter
 * @returns {*}
 */
export function downFileSSO(url, parameter) {
  return axiosSSO({
    url: url,
    params: parameter,
    method: "get",
    responseType: "blob"
  })
}
