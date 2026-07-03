import {createService, ACCESS_TOKEN, onResponseError} from 'xxweb-util'
import {dealWithError} from './dealwithError';
import md5 from "js-md5"
import {useAppStore} from "@/store";
import {refreshToken} from "@/api/index";

const axios = createService(window.project.variable.baseApi, config => {
    const token = window.app.config.globalProperties.$ls.get(ACCESS_TOKEN)
    if (token) {
        const time = new Date().valueOf()
        if (process.env.NODE_ENV === 'development') {
            config.headers['Authorization'] = token
        } else {
            config.headers['Authorization'] = token.split(' ')[0] + ' ' + md5([token.split(' ')[1], time, 'isaacxu'].join(' '));
            config.headers['X-Access-Token'] = token.split(' ')[1];
            config.headers['X-Access-Time'] = time;
        }
    }
    return {
        tokenKey: window.project.variable.tokenKey,
        token: token
    }
})
const axiosSSO = createService(window.project.variable.ssoApi, () => {
    return {}
}, null, true)
const axiosNoToken = createService(window.project.variable.baseApi, () => {
    return {}
}, null, false)
const axiosSSONoToken = createService(window.project.variable.ssoApi, () => {
    return {}
}, null, false)
const axiosWebClient = createService(window.project.variable.webClientApi, config => {
    const token = window.app.config.globalProperties.$ls.get(ACCESS_TOKEN)
    if (token) {
        const time = new Date().valueOf()
        if (process.env.NODE_ENV === 'development') {
            config.headers['Authorization'] = token
        } else {
            config.headers['Authorization'] = token.split(' ')[0] + ' ' + md5([token.split(' ')[1], time, 'isaacxu'].join(' '));
            config.headers['X-Access-Token'] = token.split(' ')[1];
            config.headers['X-Access-Time'] = time;
        }
    }
    return {
        tokenKey: window.project.variable.tokenKey,
        token: token
    }
})

axios.interceptors.response.use((response) => response,async (error) => {
    if(error.response && error.response.status === 401) {
        const originalConfig = error.config
        const store = useAppStore()
        if (!originalConfig._retry) {
            try{
                const res = await refreshToken(store.refreshToken.value)
                if(res.success){
                    store.setUserName(res.data.user.username)
                    store.setUserInfo(res.data.user)
                    store.setToken(res.data.accessToken)
                    store.setRefreshToken(res.data.refreshToken)
                    originalConfig._retry = true
                    return axios(originalConfig)
                }
            }catch (err){
            }
        }
    }
})

onResponseError(axios, (error) => dealWithError(error))
onResponseError(axiosNoToken, (error) => dealWithError(error))
onResponseError(axiosSSO, (error) => dealWithError(error))
onResponseError(axiosSSONoToken, (error) => dealWithError(error))
onResponseError(axiosWebClient, (error) => dealWithError(error))
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
axiosWebClient.interceptors.response.use((response) => {
    return response ? response.data : {}
})

export function postAction(url, parameter) {
    return axios({
        url: url,
        method: "post",
        data: parameter
    })
}

export function putAction(url, parameter) {
    return axios({
        url: url,
        method: "put",
        data: parameter
    })
}

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

export function deleteAction(url, parameter) {
    return axios({
        url: url,
        method: "delete",
        params: parameter
    })
}

export function getActionSSONoToken(url, parameter) {
    return axiosSSONoToken({
        url: url,
        method: "get",
        params: parameter
    })
}

export function postActionSSONoToken(url, parameter) {
    return axiosSSONoToken({
        url: url,
        method: "post",
        data: parameter
    })
}

export function getActionWebClient(url, parameter) {
    return axiosWebClient({
        url: url,
        method: "get",
        params: parameter
    })
}

export function putActionWebClient(url, data) {
    return axiosWebClient({
        url: url,
        method: "put",
        data: data
    })
}
