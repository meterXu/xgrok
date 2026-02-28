const {hostname, version,readLinesInRange,getLineCount,checkUrl,saveAppCfg, getAppCfg, isElectron} = require("../util");
const machineId = require('node-machine-id');
const {BrowserWindow, nativeImage}  = require('electron')
const path = require("node:path");
const AutoLaunch = require('auto-launch');
const net = require('node:net')
const {serviceType} = require("../enum");
async function getSystemInfo(data){
    return Promise.resolve({
        device_id:machineId.machineIdSync(true),
        hostname:hostname(),
        osVersion:version()
    })
}

/**
 * 检查Web地址是否可以访问
 */
async function checkWeb({name, domain, port}) {
    return checkUrl(name, domain, port).then(res=>{
        return Promise.resolve({
            data:res,
            message:res?'地址可访问':'地址不可访问'
        })
    }).catch(err=>{
        return Promise.reject(err)
    })
}

/**
 * 检查指定端口是否被占用
 * @param {string} host - 要检查的地址
 * @param {number} checkPort - 要检查的端口号
 * @param {number} type - 要检查的类型
 * @returns {Promise<boolean>} - 如果端口被占用则返回 false，否则返回 true
 */
async function checkPort(host,checkPort,type) {
    return new Promise((resolve, reject) => {
        if(type===serviceType.tcp){
            const socket = new net.Socket();
            socket.setTimeout(3000); // 设置超时时间，根据需要调整
            socket.once('connect', () => {
                console.log(`端口 ${checkPort} 在 ${host} 连接成功。`);
                // 设置一个延迟来检查连接状态
                setTimeout(() => {
                    socket.write('PING', (err) => {
                        if (err) {
                            resolve({
                                data:true,
                                message:'本地代理端口未被占用'
                            }); // 远程关闭，视为未被占用
                        } else {
                            resolve({
                                data:false,
                                message:'本地代理端口已被其他服务占用，请换一个'
                            }); // 正常连接且可响应
                        }
                        socket.destroy();
                    });
                }, 1000);
            });
            socket.once('timeout', () => {
                resolve({
                    data:true,
                    message:'本地端口未被占用'
                })
                socket.destroy();
            });
            socket.once('error', (err) => {
                if (err.code === 'ECONNREFUSED') {
                    resolve({
                        data:true,
                        message:'本地端口未被占用'
                    })
                } else {
                    resolve({
                        data:false,
                        message:'本地端口已被其他服务占用，请换一个'
                    })
                }
            });
            socket.connect(checkPort, host);
        }else{//todo udp默认未占用
            resolve({
                data:true,
                message:'本地代理端口未被占用'
            })
        }
    })
}

async function randomGetPort(){
    global.usedProxyPorts = global.usedProxyPorts||[]
    for(let i=51000;i<=52000;i++){
        let res = await checkPort(i)
        if(res.data&&!global.usedProxyPorts.some(c=>c===i)){
            global.usedProxyPorts.push(i)
            return Promise.resolve(i)
        }
    }
}

async function openDialog(data){
    const appIcon = nativeImage.createFromPath(global.project.appIcon[process.platform])
    const dialogWindow = new BrowserWindow({
        title:data.title,
        width: 800,
        height: 600,
        icon: appIcon,
        webPreferences: {
            preload: path.join(__dirname,'../../ipc', 'preload.js'),
            nodeIntegration: false
        }
    });
    if(process.env.NODE_ENV==='development'){
        await dialogWindow.loadURL(project.viewUrl)
        dialogWindow.webContents.openDevTools();
    }else{
        dialogWindow.loadFile(project.viewUrl)
    }
    setTimeout(()=>{
        dialogWindow.webContents.send('view/route',data)
    },100)
}

/**
 * @param {Object:{startIndex?:number,length:number}} data
 * @return {Promise<string[]>}
 */
async function getLog(data){
    const lineCount = await getLineCount(global.project.logPath)
    let start = 0;
    let end = 0;

    if(lineCount>(data.startIndex+data.length)){
        if(start===0){
            start = lineCount-data.length
            end = lineCount
        }else{
            start = data.startIndex
            end = data.startIndex+data.length
        }
    }else{
        start = data.startIndex
        end = lineCount
    }
    let records = await readLinesInRange(global.project.logPath,start,end)
    return Promise.resolve({
        records:records,
        endIndex:end
    })
}

function getXgrokAppCfg(){
    return getAppCfg()
}
function setXgrokAppCfg(data){
    if(isElectron()){
        const minecraftAutoLauncher = new AutoLaunch({
            name: 'xgrok',
            path: global.project.appAbsoluteName
        });
        if(data.hasOwnProperty('autoLaunch')){
            if(data.autoLaunch){
                minecraftAutoLauncher.enable()
                data.autoServer = !!global.xgrokPid
            }else{
                minecraftAutoLauncher.disable()
                data.autoServer = false
            }
        }
    }
    return saveAppCfg(data)
}

module.exports={
    getSystemInfo,
    checkPort,
    randomGetPort,
    openDialog,
    getLog,
    checkWeb,
    getXgrokAppCfg,
    setXgrokAppCfg,
}
