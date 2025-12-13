import {createService, ACCESS_TOKEN, onResponseError} from 'xxweb-util'
import {dealWithError} from './dealwithError';
import md5 from "js-md5"

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
}, null, false)
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

export function getActionWebClient(url, parameter) {
    return axiosWebClient({
        url: url,
        method: "get",
        params: parameter
    })
}

export function postActionWebClient(url, data) {
    return axiosWebClient({
        url: url,
        method: "post",
        data: data
    })
}

export function putActionWebClient(url, data) {
    return axiosWebClient({
        url: url,
        method: "put",
        data: data
    })
}

export function deleteActionWebClient(url, parameter) {
    return axiosWebClient({
        url: url,
        method: "delete",
        params: parameter
    })
}
