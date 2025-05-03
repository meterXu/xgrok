const {parentPort}= require("worker_threads");
const {checkProcess,checkUrl,checkServerOnline} = require("../libs/util");

global.parentPort = parentPort
parentPort.timerId=null
parentPort.isAllOnLine = false

async function checkThread(pid,webSource,tcpSource){
    if(!checkProcess(pid)){
        parentPort.postMessage({
            type: 'pidIsNull'
        })
        clearTimeout(parentPort.timerId)
        parentPort.timerId = null
        parentPort.isAllOnLine = false
    }else{
        for(let web of webSource){
            web.isOnline = await checkUrl(web.params[0],web.params[1],web.params[2])
        }
        for(let tcp of tcpSource){
            tcp.isOnline = await checkServerOnline(tcp.params[0],tcp.params[1])
        }
        let total = webSource.length+tcpSource.length
        let step = webSource.filter(c=>c.isOnline).length+tcpSource.filter(c=>c.isOnline).length
        if(parentPort.isAllOnLine && step!==total){
            parentPort.postMessage({
                type: 'pidIsNull'
            })
            clearTimeout(parentPort.timerId)
            parentPort.timerId = null
        }else{
            parentPort.isAllOnLine = step===total
            let percentage = step/total*100
            parentPort.postMessage({
                type: 'process',
                data:percentage===0?1:percentage
            })
            parentPort.timerId = setTimeout(()=>checkThread(pid,webSource,tcpSource),parentPort.isAllOnLine?3000:1000)
        }
    }
}

parentPort.on('message',(result)=>{
    switch (result.type){
        case 'start':{
            let {pid,webSource,tcpSource} = result.data
            checkThread(pid,webSource,tcpSource)
            break;
        }
        case 'stop':{
            parentPort.timerId&&clearTimeout(parentPort.timerId)
            parentPort.timerId = null
            parentPort.isAllOnLine = false
            break;
        }
    }
})