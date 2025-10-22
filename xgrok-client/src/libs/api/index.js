const axios=require('axios')
const urls={
    api:{
        login:'/',
        status:'/api/status'
    }
}
const service = axios.create()

function login(){
    return service({
        url:`http://${global.project.webServer.addr}:${global.project.webServer.port}${urls.api.login}`,
        method:'get',
        headers: {
            Authorization: 'Basic ' + btoa(`${global.project.webServer.user}:${global.project.webServer.password}`)
        }
    })
}

function apiStatus(){
    return service({
        url:`http://${global.project.webServer.addr}:${global.project.webServer.port}${urls.api.status}`,
        headers:{
            Authorization: 'Basic ' + btoa(`${global.project.webServer.user}:${global.project.webServer.password}`)
        }
    })
}

module.exports={login,apiStatus}