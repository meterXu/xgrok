const {parentPort}= require("worker_threads");
const {checkProcess} = require("../libs/util");

global.parentPort = parentPort
self.timerId=null
self.on('message',(result)=>{
    let {pid} = result
    switch (result.type){
        case 'start':{
            self.timerId = setInterval(()=>{
                if(!checkProcess(pid)){
                    parentPort.postMessage({
                        type: 'pidIsNull'
                    })
                }
            },3000)
            break;
        }
        case 'stop':{
            break;
        }
    }
})