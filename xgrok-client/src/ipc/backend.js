// 在主进程中
const { ipcMain, app, dialog, shell} = require('electron');
const xgrokConfModel = require("../models/xgrokConfModel");
const {turnOn,turnOff, setXY,
    minWindow,
    maxWindow,
    closeWindow,
    hiddenWindow,
    openExternal} = require("../libs/backend/xgrok");
const {checkPort,getSystemInfo,openDialog,getLog,checkWeb} = require("../libs/backend/system");
const {checkUpdate} = require("../libs/util");
const {autoUpdater} = require("electron-updater");
ipcMain.handle('xgrok', async (event, arg) => {
    let res = {success:true,type:arg.type,data:null}
    try {
        switch (arg.type){
            case 'turnOn':{
                const xgrokConf= new xgrokConfModel(arg.data)
                await xgrokConf.exchangePorts()
                let turnData = await turnOn(xgrokConf)
                global.xgrokPid=turnData.pid
                res.success = !!turnData.pid
                res.message = turnData.message
                res.data = turnData.pid
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
            }break
            case 'openExternal':{
                openExternal(arg.data)
            }break
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
            case 'checkWeb':{
                let _checkRes = await checkWeb(arg.data)
                res.data = _checkRes.data
                res.message = _checkRes.message
            }break
            case 'viewLog':{
                openDialog(arg.data)
            }break
            case 'getLog':{
                res.data = await getLog(arg.data)
            }break
            case 'checkUpdate':{
                checkUpdate(app,autoUpdater,dialog,shell).catch(()=>{
                    dialog.showMessageBox({
                        type: 'info',
                        buttons: ['确定'],
                        title: '提示',
                        detail: '无可用更新，当前已是最新版本！'
                    })
                })
            }
        }
    }catch (err){
        res.success=false
        res.message = err.message
    }
    return res
})