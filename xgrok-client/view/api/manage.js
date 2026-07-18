import {createService, onResponseError} from 'xxweb-util'
import {dealWithError} from './dealwithError';
import md5 from "js-md5"
import {refreshToken} from "@/api/index";
import {useAppStore} from "@/store";

function initHeaders(config){
    const store = useAppStore()
    const token = store.token
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
    return token
}

const axios = createService(window.project.variable.baseApi, config => {
    const token = initHeaders(config)
    return {
        tokenKey: window.project.variable.tokenKey,
        token: token
    }
})
const axiosSSO = createService(window.project.variable.ssoApi, config => {
    const token = initHeaders(config)
    return {
        tokenKey: window.project.variable.tokenKey,
        token: token
    }
})
const axiosNoToken = createService(window.project.variable.baseApi, () => {
    return {}
}, null, false)
const axiosSSONoToken = createService(window.project.variable.ssoApi, () => {
    return {}
}, null, false)
const axiosWebClient = createService(window.project.variable.webClientApi, config => {
    const token = initHeaders(config)
    return {
        tokenKey: window.project.variable.tokenKey,
        token: token
    }
})

let refreshPromise = null

axios.interceptors.response.use((response) => response, async (error) => {
    if (error.response && error.response.status === 401) {
        const store = useAppStore()
        const originalConfig = error.config
        if (!originalConfig._retry) {
            originalConfig._retry = true
            // 如果当前没有正在进行的刷新，则发起一个新的刷新请求
            if (!refreshPromise) {
                refreshPromise = refreshToken(store.refreshToken)
                    .then(res => {
                        if (res.success) {
                            store.setUserName(res.data.user.username)
                            store.setUserInfo(res.data.user)
                            store.setToken(res.data.accessToken)
                            store.setRefreshToken(res.data.refreshToken)
                        }
                        return res
                    })
                    .finally(() => {
                        refreshPromise = null
                    })
            }
            // 等待刷新完成（可能是自己发起的，也可能是其他请求发起的）
            try {
                const res = await refreshPromise
                if (res && res.success) {
                    return axios(originalConfig)
                }
            } catch (err) {
                // refreshToken 本身失败（网络错误等）
            }
        }
    }
    return Promise.reject(error)
})

onResponseError(axios, (error) => dealWithError(error))
onResponseError(axiosNoToken, (error) => dealWithError(error))
onResponseError(axiosSSO, (error) => dealWithError(error))
onResponseError(axiosSSONoToken, (error) => dealWithError(error))
onResponseError(axiosWebClient, (error) => dealWithError(error))
axios.interceptors.response.use((response) => {
    // response.config exists on real axios responses, not on already-unwrapped data from retries
    return response && response.config ? response.data : (response || {})
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

export function postActionSSO(url, parameter) {
    return axiosSSO({
        url: url,
        method: "post",
        data: parameter
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
