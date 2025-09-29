const axios=require('axios')
const urls={
    api:{
        login:'/',
        status:'/api/status'
    }
}
const service = axios.create({
    baseURL:`http://${global.project.webServer.addr}:${global.project.webServer.port}`
})

function login(){
    return service({
        url:urls.api.login,
        method:'get',
        headers: {
            Authorization: 'Basic ' + btoa(`${global.project.webServer.user}:${global.project.webServer.password}`)
        }
    })
}

function apiStatus(){
    return service({
        url:urls.api.status,
        headers:{
            Authorization: 'Basic ' + btoa(`${global.project.webServer.user}:${global.project.webServer.password}`)
        }
    })
}

module.exports={login,apiStatus}