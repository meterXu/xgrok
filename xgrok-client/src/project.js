const {platform} = require("./libs/util");
const path = require("path");
const rootPath = path.resolve(__dirname, '..');
require('dotenv').config({path: `${rootPath}/.env.${process.env.NODE_ENV}`});

function getAppData(){
    try{
        if(process.platform==='darwin'){
            return path.join(process.env.HOME, 'Library', 'Logs', 'xgrok');
        }else if(process.platform==="win32"){
            return process.env.APPDATA
        } else if(process.platform==="linux"){
            return path.join(process.env.HOME, '.config', 'xgrok', 'logs');
        }
    }catch (err){
        global.logger.error(err.message)
    }
}

const getProject=function (app,mode){
    const appPath = app?.getAppPath()||''
    const _paltform = platform()
    global?.logger?.info(`mode: ${mode}`)
    global?.logger?.info(`appPath: ${appPath}`)
    global?.logger?.info(`appData: ${getAppData()}`)
    if(mode==='development'){
        return {
            viewUrl:"http://localhost:5173/",
            clientRootPath:path.join(appPath,'../execute/',_paltform),
            appPath:appPath,
            appData:getAppData(),
            auth:{
                method:process.env.VITE_APP_authMethod,
                authToken:process.env.VITE_APP_authToken,
            },
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
            clientRootPath:path.join(appPath,'../app.asar.unpacked/execute/',_paltform),
            appPath:appPath,
            appData:getAppData(),
            auth:{
                method:process.env.VITE_APP_authMethod,
                authToken:process.env.VITE_APP_authToken,
            },
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
