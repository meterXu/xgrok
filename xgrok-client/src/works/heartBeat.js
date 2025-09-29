const {parentPort}= require("worker_threads");
const {checkProcess} = require("../libs/util");

global.parentPort = parentPort
parentPort.timerId=null
parentPort.isAllOnLine = false
parentPort.isStopCheck = false

async function checkThread(pid,webSource,tcpSource){
    if(!checkProcess(pid)){
        parentPort.postMessage({
            type: 'pidIsNull'
        })
        clearTimeout(parentPort.timerId)
        parentPort.timerId = null
    }else{
        parentPort.timerId&&clearTimeout(parentPort.timerId)
        if(!parentPort.isStopCheck){
            parentPort.timerId = setTimeout(()=>checkThread(pid,webSource,tcpSource),3000)
        }
    }
}

parentPort.on('message',(result)=>{
    switch (result.type){
        case 'start':{
            let {pid,webSource,tcpSource} = result.data
            parentPort.isStopCheck = false
            checkThread(pid,webSource,tcpSource)
            break;
        }
        case 'stop':{
            parentPort.isStopCheck = true
            parentPort.timerId&&clearTimeout(parentPort.timerId)
            parentPort.timerId = null
            break;
        }
    }
})
