import {useAppStore} from "@/store";

if(!window.heartBeatWorker){
    window.heartBeatWorker = new Worker(new URL('./app.worker.js', import.meta.url));
}
heartBeatWorker.onmessage=function (e){
    switch (e.data.type){
        case 'checkServer':{
            updateServer(e.data)
        }break
    }
}

function updateServer(data){
    const store = useAppStore()
    const {selectedServer} = store
    if(selectedServer?.value){
        let _data = {...selectedServer?.value}
        _data.is_online = data.is_online
        _data.statusClass = data.statusClass
        store.setSelectedServer(_data)
    }
}

export function sendMessage(msgObj){
    heartBeatWorker.postMessage(msgObj)
}