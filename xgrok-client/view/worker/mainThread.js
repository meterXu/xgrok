import {useAppStore} from "@/store";

if(!window.worker){
    window.worker = new Worker(new URL('./app.worker.js', import.meta.url));
}
worker.onmessage=function (e){
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
        selectedServer.value.is_online = data.is_online
        selectedServer.value.statusClass = data.statusClass
        store.setSelectedServer(selectedServer.value)
    }
}

export function sendMessage(msgObj){
    worker.postMessage(msgObj)
}