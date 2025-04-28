const {parentPort}= require("worker_threads");
const {checkProcess} = require("../libs/util");

global.parentPort = parentPort
parentPort.timerId=null
parentPort.on('message',(result)=>{
    switch (result.type){
        case 'start':{
            let {pid,webPorts,tcpPorts} = result.data
            parentPort.timerId = setInterval(()=>{
                if(!checkProcess(pid)){
                    parentPort.postMessage({
                        type: 'pidIsNull'
                    })
                    clearInterval(parentPort.timerId)
                    parentPort.timerId = null
                }
            },3000)
            break;
        }
        case 'stop':{
            parentPort.timerId&&clearInterval(parentPort.timerId)
            parentPort.timerId = null
            break;
        }
    }
})