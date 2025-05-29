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
        let total = webSource.length+tcpSource.length
        let step = 0
        for(let web of webSource){
            web.isOnline = await checkUrl(web.params[0],web.params[1],web.params[2])
            step = webSource.filter(c=>c.isOnline).length+tcpSource.filter(c=>c.isOnline).length
            sendProcess(total,step)
            await sleep(100)
        }
        for(let tcp of tcpSource){
            tcp.isOnline = await checkServerOnline(tcp.params[0],tcp.params[1])
            step = webSource.filter(c=>c.isOnline).length+tcpSource.filter(c=>c.isOnline).length
            sendProcess(total,step)
            await sleep(200)
        }
        parentPort.isAllOnLine = step===total
        parentPort.timerId = setTimeout(()=>checkThread(pid,webSource,tcpSource),parentPort.isAllOnLine?3000:1000)
    }
}

function sendProcess(total,step){
    let percentage = Math.floor(step/total*100)
    parentPort.postMessage({
        type: 'process',
        data:percentage
    })
}

function sleep(time=100){
    return new Promise(resolve => {
        setTimeout(()=>{
            resolve(time)
        },time)
    })
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