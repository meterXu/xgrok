// 在主进程中
const { ipcMain } = require('electron');
const xgrokConfModel = require("../models/xgrokConfModel");
const {turnOn,turnOff, setXY,
    minWindow,
    maxWindow,
    closeWindow,
    hiddenWindow,
    openExternal} = require("../libs/backend/xgrok");
const {checkPort,getSystemInfo} = require("../libs/backend/system");
ipcMain.handle('xgrok', async (event, arg) => {
    let res = {success:true,type:arg.type,data:null}
    try {
        switch (arg.type){
            case 'turnOn':{
                const xgrokConf= new xgrokConfModel(arg.data)
                await xgrokConf.exchangePorts()
                let pid = await turnOn(xgrokConf)
                global.xgrokPid=pid
                res.data = {pid:pid}
            }break
            case 'turnOff':{
                res.success = await turnOff(arg.data)
            }break
            case 'setXY':{
                setXY(arg.data)
            }break
            case 'minWindow':{
                minWindow(arg.data)
            }break
            case 'maxWindow':{
                maxWindow(arg.data)
            }break
            case 'closeWindow':{
                closeWindow(arg.data)
            }break
            case 'hiddenWindow':{
                hiddenWindow(arg.data)
            }
            case 'openExternal':{
                openExternal(arg.data)
            }
        }
    }catch (err){
        res.success=false
        res.message = err.message
    }
    return res
});
ipcMain.handle('system',async (event,arg)=>{
    let res = {success:true,type:arg.type,data:null}
    try {
        switch (arg.type){
            case 'getSystemInfo':{
                res.data = await getSystemInfo(arg.data)
            }break
            case 'checkPort':{
                let _checkRes = await checkPort(arg.data)
                res.data = _checkRes.data
                res.message = _checkRes.message
            }break
        }
    }catch (err){
        res.success=false
        res.message = err.message
    }
    return res
})