const {platform, arch} = require("./libs/util");
const path = require("path");
const fs = require("node:fs");
const rootPath = path.resolve(__dirname, '..');
require('dotenv').config({path: `${rootPath}/.env.${process.env.NODE_ENV}`});

function getAppData(){
    try{
        let _path = ''
        if(process.platform==='darwin'){
            _path=path.join(process.env.HOME, 'Library', 'Logs', 'xgrok');
        }else if(process.platform==="win32"){
            _path=process.env.APPDATA
        } else if(process.platform==="linux"){
            _path=path.join(process.env.HOME, '.config', 'xgrok', 'logs');
        }
        if (!fs.existsSync(_path)) {
            fs.mkdirSync(_path)
        }
        return _path
    }catch (err){
        global.logger.error(err.message)
    }
}

function getArch() {
    const archMap = {
        x64: 'amd64',
        arm64: 'arm64',
        mips64: 'mips64'
    }
    return archMap[arch()] || arch()
}

const getProject=function (app,mode){
    const appPath = app?.getAppPath()||''
    const _paltform = platform()
    global?.logger?.info(`mode: ${mode}`)
    global?.logger?.info(`appPath: ${appPath}`)
    global?.logger?.info(`appData: ${getAppData()}`)
    const xgrokAppCfgPath = path.join(getAppData(), `.xgrokApp.json`)
    if(!fs.existsSync(xgrokAppCfgPath)){
        fs.writeFileSync(xgrokAppCfgPath,JSON.stringify({
            theme: 'system',
            autoLaunch: false,
            autoServer:false,
            exitInTaskBar: true,
            proxy: '',
            pid:0
        },null, 2),'utf8')
    }
    if(mode==='development'){
        return {
            viewUrl:"http://localhost:5173/",
            serverPort:4446,
            startWebServerProt:7400,
            auth:{
                method:'token',
                token:'xgrok_84hG5!Jk9m',
            },
            webServer:{
                addr:'127.0.0.1',
                port:7400,
                user:'xgrok',
                password:'xgrok'
            },
            clientRootPath:path.join(appPath,'../execute/',_paltform, getArch()),
            appPath:appPath,
            appAbsoluteName:process.execPath,
            appData:getAppData(),
            xgrokCoreCfgPath:path.join(getAppData(), '.xgrok.cfg'),
            logPath:path.join(getAppData(),'.xgrok-core.log'),
            xgrokAppCfgPath:xgrokAppCfgPath,
            appIcon:{
                darwin:path.join(appPath||__dirname,'../','public/assets/icon.icns'),
                win32:path.join(appPath||__dirname,'../','public/assets/icon.ico'),
                linux:path.join(appPath||__dirname,'../','public/assets/icon2.png'),
            },
            icoIcon:{
                darwin:path.join(appPath||__dirname,'../','public/assets/icon.icns'),
                win32:path.join(appPath||__dirname,'../','public/assets/icon.ico'),
                linux:path.join(appPath||__dirname,'../','public/assets/icon2.png'),
            },
            trayIcon:{
                darwin:path.join(appPath||__dirname,'../','public/assets/trayTemplate.png'),
                win32:path.join(appPath||__dirname,'../','public/assets/icon.ico'),
                linux:path.join(appPath||__dirname,'../','public/assets/icon2.png'),
            }
        }
    }else{
        return {
            viewUrl:'dist/index.html',
            serverPort:4446,
            startWebServerProt:7400,
            auth:{
                method:'token',
                token:'xgrok_84hG5!Jk9m',
            },
            webServer:{
                addr:'127.0.0.1',
                port:7400,
                user:'xgrok',
                password:'xgrok'
            },
            clientRootPath:path.join(appPath,'../app.asar.unpacked/execute/',_paltform, getArch()),
            appPath:appPath,
            appAbsoluteName:process.execPath,
            appData:getAppData(),
            xgrokCoreCfgPath:path.join(getAppData(), '.xgrok.cfg'),
            logPath:path.join(getAppData(),'.xgrok-core.log'),
            xgrokAppCfgPath:xgrokAppCfgPath,
            appIcon:{
                darwin:path.join(appPath||__dirname,appPath?'/':'../','public/assets/icon.icns'),
                win32:path.join(appPath||__dirname,appPath?'/':'../','public/assets/icon.ico'),
                linux:path.join(appPath||__dirname,appPath?'/':'../','public/assets/icon2.png'),
            },
            icoIcon:{
                darwin:path.join(appPath||__dirname,appPath?'/':'../','public/assets/icon.icns'),
                win32:path.join(appPath||__dirname,appPath?'/':'../','public/assets/icon.ico'),
                linux:path.join(appPath||__dirname,appPath?'/':'../','public/assets/icon2.png'),
            },
            trayIcon:{
                darwin:path.join(appPath||__dirname,appPath?'/':'../','public/assets/trayTemplate.png'),
                win32:path.join(appPath||__dirname,appPath?'/':'../','public/assets/icon.ico'),
                linux:path.join(appPath||__dirname,appPath?'/':'../','public/assets/icon2.png'),
            }
        }
    }
}

module.exports=getProject
