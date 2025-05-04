let timerMap = {}
const loop = 6000
self.onmessage = function (e) {
    switch (e.data.type){
        case 'openCheckServer':{
            checkServer(e.data.baseApi,e.data.server_id,e.data.domain,e.data.port);
        }break
        case 'closeCheckServer':{
            closeCheckServer(e.data.server_id);
        }break
    }

};
async function _task(baseApi,server_id,domain,port){
    try{
        const baseUrl = `${baseApi}/server/checkServerOnline`
        const params = new URLSearchParams({domain,port});
        const urlWithParams = `${baseUrl}?${params.toString()}`;
        let response = await fetch(urlWithParams)
        response = await response.json()
        self.postMessage({
            type:'checkServer',
            is_online:response.data?1:0,
            statusClass:`${response.data?'server-status-icon-success server-status-online':'server-status-icon-danger server-status-offline'}`
        })
    }catch (err){
        self.postMessage({
            type:'checkServer',
            is_online:null,
            statusClass:null
        })
        console.error(err)
    }
    if(timerMap[server_id].timer!==-1){
        timerMap[server_id].timer=setTimeout(()=>_task(baseApi,server_id,domain,port),loop)
    }
}
async function checkServer(baseApi,server_id,domain,port) {
    if(!server_id){return}
    timerMap[server_id] = {timer:null}
    if(server_id){
        await _task(baseApi,server_id,domain,port)
    }
}

function closeCheckServer(server_id){
    if(server_id){
        timerMap[server_id]?.timer&&clearTimeout(timerMap[server_id].timer)
        timerMap[server_id] = {timer:-1}
    }
}