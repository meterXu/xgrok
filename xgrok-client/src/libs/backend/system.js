const {hostname, version} = require("../util");
const net = require('net');
const {BrowserWindow, nativeImage}  = require('electron')
const path = require("node:path");

async function getSystemInfo(data){
    return Promise.resolve({
        hostname:hostname(),
        osVersion:version()
    })
}

/**
 * 检查指定端口是否被占用
 * @param {number} port - 要检查的端口号
 * @returns {Promise<boolean>} - 如果端口被占用则返回 false，否则返回 true
 */
async function checkPort(port) {
    return new Promise((resolve,reject) => {
       try{
           // 创建一个 TCP 服务器
           const server = net.createServer();
           // 监听错误事件
           server.on('error', (err) => {
               if (err.code === 'EADDRINUSE') {
                   resolve({
                       data:false,
                       message:'本地代理端口已被其他服务占用，请换一个'
                   });
               } else {
                   resolve({
                       data:true,
                       message:'本地代理端口未被占用'
                   });
               }
           });
           // 监听成功事件
           server.listen(port,'127.0.0.1', () => {
               server.close();
               resolve({
                   data:true,
                   message:'本地端口未被占用'
               });
           });
       }catch (error){
           reject(error)
       }
    });
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

module.exports={
    getSystemInfo,
    checkPort,
    randomGetPort,
    openDialog
}