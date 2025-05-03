const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('electronAPI', {
    turnOn:(data)=>ipcRenderer.invoke('xgrok', {
        type:'turnOn',
        data:data
    }),
    turnOff:(data)=>ipcRenderer.invoke('xgrok', {
        type:'turnOff',
        data:data
    }),
    setXY:(data)=>ipcRenderer.invoke('xgrok', {
        type:'setXY',
        data:data
    }),
    minWindow:(data)=>ipcRenderer.invoke('xgrok',{
        type:'minWindow',
        data:data
    }),
    maxWindow:(data)=>ipcRenderer.invoke('xgrok',{
        type:'maxWindow',
        data:data
    }),
    hiddenWindow:(data)=>ipcRenderer.invoke('xgrok',{
        type:'hiddenWindow',
        data:data
    }),
    closeWindow:(data)=>ipcRenderer.invoke('xgrok',{
        type:'closeWindow',
        data:data
    }),
    openExternal:(data)=>ipcRenderer.invoke('xgrok',{
        type:'openExternal',
        data:data
    }),
    getSystemInfo:(data)=>ipcRenderer.invoke('system',{
        type:'getSystemInfo',
        data:data
    }),
    checkPort:(data)=>ipcRenderer.invoke('system',{
        type:'checkPort',
        data:data
    }),
    onAppQuit:(callback)=>ipcRenderer.on('appQuit',(_event, value) => callback(value)),
    onRefreshPid:(callback)=>ipcRenderer.on('refreshPid',(_event, value) => callback(value)),
    onProcess:(callback)=>ipcRenderer.on('process',(_event, value) => callback(value))
})