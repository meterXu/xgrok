const path = require("node:path");
const {execFile} = require("node:child_process");
const fs = require("node:fs");
const {stringify} = require('yaml')
const {killPid} = require("../util");
const {serviceType, hostType} = require('../enum')
const {platform,arch} = require("../util");
const { shell } = require('electron');
const http = require('http');
const httpProxy = require('http-proxy');
const net = require('net')
const {checkPort} = require("./system");
const {Worker} = require("worker_threads");

const localhost = '127.0.0.1'
initBeat()
async function turnOn(xgrokConf){
    try{
        global.webServers = global.webServers||[]
        global.tcpServers = global.tcpServers||[]
        if(xgrokConf.tunnelWebs.length===0&&xgrokConf.tunnelServices.length===0){
            return Promise.reject({message:'配置为空'})
        }else{
            saveYamlConf(xgrokConf.server,xgrokConf.tunnelWebs,xgrokConf.tunnelServices)
            const serviceNames = xgrokConf.tunnelWebs.map(c=>c.name).concat(xgrokConf.tunnelServices.map(c=>c.name))
            let proxyWebs = xgrokConf.tunnelWebs.filter(c=>c.is_remote===hostType.remote)
            let proxyServices = xgrokConf.tunnelServices.filter(c=>c.is_remote===hostType.remote)
            if(proxyWebs.length>0){
                global.webServers.push(...await startWebProxy(proxyWebs))
            }
            if(proxyServices.length>0){
                global.tcpServers.push(...await startTcpProxy(proxyServices))
            }
            const pid = await startXgrok(serviceNames)
            global.logger.info(`xgrok pid is [${pid}]`)
            startBeat(pid,global.webServers,global.tcpServers)
            return Promise.resolve(pid)
        }
    }catch (err){
        return Promise.reject({message:err.message})
    }
}
async function turnOff(pid){
    fs.existsSync(userXgrokCfgFilePath())&&fs.unlinkSync(userXgrokCfgFilePath())
    global.logger.info(`kill xgrok,pid is ${pid}`)
    global.worker.postMessage({
        type:'stop'
    })
    return await killPid(pid)
}
function startXgrok(names){
    return new Promise(async (resolve, reject) => {
        global.logger.info(`os arch: ${arch()}`)
        global.logger.info(`os platform: ${platform()}`)
        global.logger.info(`start xgrok, the client root path is ${global.project.clientRootPath}`)
        global.logger.info(`config:\r\n${readXgrokCfgFile(userXgrokCfgFilePath())}`)
        const xgrok = execFile('./compile', [`-config=${userXgrokCfgFilePath()}`,'start',...names],{
            cwd:global.project.clientRootPath,
            detached: true
        },(error, stdout, stderr)=>{
            if(error){
                global.logger.error(error)
            }
        })
        xgrok.on('close', (data) => {
            return Promise.resolve({success:true,message:'关闭成功'})
        });
        resolve(xgrok.pid)
    })

}
function saveYamlConf(serverDetail,webDetails,serviceDetails){
    const yamlConf = generateYamlConf(serverDetail,webDetails,serviceDetails)
    fs.writeFileSync(userXgrokCfgFilePath(), yamlConf);
}
function userXgrokCfgFilePath(){
    const userFolderPath = global.project.appData;
    if(!fs.existsSync(userFolderPath)){
        fs.mkdirSync(userFolderPath)
    }
    const fileName = '.xgrok.cfg';
    return path.join(userFolderPath, fileName);
}
function generateYamlConf(serverDetail,WebDetails,serviceDetails){
    let webTunnels = WebDetails.map(web=>{return {[web.name]:{proto:{http:web.port}}}})
    let serviceTunnels = serviceDetails.map(service=>{
        return {
            [service.name]:{
                remote_port:service.remote_port,
                proto:{
                    [[null,'tcp','udp'][serviceType.tcp]]:service.port
                }
            }
        }
    })
    const yamlConf = {
        server_addr:`${serverDetail.domain}:${serverDetail.port}`,
        trust_host_root_certs:false,
        tunnels:{}
    }
    webTunnels.forEach(web=>{
        const we = Object.entries(web)
        yamlConf.tunnels[we[0][0]]=we[0][1]
    })
    serviceTunnels.forEach(service=>{
        const se = Object.entries(service)
        yamlConf.tunnels[se[0][0]]=se[0][1]
    })
    return stringify(yamlConf)
}
function readXgrokCfgFile(xgrokCfgPath){
    return fs.readFileSync(xgrokCfgPath,{encoding:'utf-8'})
}
function setXY(data){
    const pos = win.getPosition();
    pos[0] = pos[0] + data.pageX - data.mouseX;
    pos[1] = pos[1] + data.pageY - data.mouseY;
    global.win.setPosition(pos[0], pos[1], true);
}
function minWindow(data){
    global.win.minimize();
}
function maxWindow(data){
    if(process.platform==='darwin'){
        if(global.win.isFullScreen()) {
            global.win.setFullScreen(false)
        }else{
            global.win.setFullScreen(true)
        }
    }else{
        if(global.win.isMaximized()) {
          global.win.restore();
        }else{
            global.win.maximize();
        }
    }
}
function closeWindow(data){
    global.win.close();
}
function hiddenWindow(data){
    global.win.hide();
}
async function openExternal(data){
    // 在外部浏览器中打开链接
    shell.openExternal(data);
}
async function startWebProxy(proxyWebs){
    let webProxyArray = []
    for(let proxyWeb of proxyWebs){
        const proxy = httpProxy.createProxyServer({
            changeOrigin:true,
            secure:false,
        });
        const webServer = http.createServer((req,res)=>{
            proxy.web(req,res,{target:proxyWeb.host,ignorePath: false},(error)=>{
                global.logger.error(`web proxy[${proxyWeb.host}] error:`, error);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end(`web proxy[${proxyWeb.host}] error:${error.message||'Internal Server Error'}`);
            })
        })
        // 处理 WebSocket 请求
        webServer.on('upgrade', (req, socket, head) => {
            const target = proxyWeb.host
            proxy.ws(req, socket, head, { target: target });
        });
        let res = await startWebServer(webServer,proxyWeb)
        if(res){
            webProxyArray.push({tunnelConfig:proxyWeb,proxyServer:res})
        }
    }
    return webProxyArray
}
async function startWebServer(webServer,proxyWeb){
    return new Promise(async(resolve, reject) => {
        try{
            let checkRes = await checkPort(proxyWeb.port)
            if(checkRes.data){
                webServer.listen(proxyWeb.port,localhost,(error)=>{
                    if(error){
                        global.logger.error(`Error starting web proxy[${localhost}:${proxyWeb.host}] server:`, error);
                        resolve(null)
                    }else{
                        global.logger.info(`web proxy[${proxyWeb.host}] server is running at http://${localhost}:${proxyWeb.port}`);
                        resolve(webServer)
                    }
                })
            }else{
                global.logger.error(`${localhost}端口${proxyWeb.port}已被其他服务占用，代理无法启动`);
                resolve(null)
            }
        }catch (error){
            global.logger.error(`Error starting web proxy[${localhost}:${proxyWeb.host}] server:`, error);
            resolve(null)
        }
    })
}
async function startTcpProxy(proxyServices){
    let tcpProxyArray = []
    for(let proxyService of proxyServices){
        let tcpServer = await startTcpServer(proxyService)
        if(tcpServer){
            tcpProxyArray.push({tunnelConfig:proxyService,proxyServer:tcpServer})
        }
    }
    return tcpProxyArray
}
async function startTcpServer(tcpServer){
    return new Promise(async (resolve, reject) => {
        try{
            let checkRes = await checkPort(tcpServer.port)
            if(checkRes.data){
                const serverSocket = net.createServer((sourceSocket)=>{
                    const targetSocket = net.createConnection(tcpServer.target_port,tcpServer.host)
                    sourceSocket.on('data',(chunk)=>{
                        targetSocket.write(chunk)
                    })
                    targetSocket.on('data',(chunk)=>{
                        sourceSocket.write(chunk)
                    })
                    sourceSocket.on('error',(chunk)=>{
                        targetSocket.end()
                    })
                    targetSocket.on('error',(chunk)=>{
                        sourceSocket.end()
                    })
                    sourceSocket.on('end',(chunk)=>{
                        targetSocket.end()
                    })
                    targetSocket.on('end',(chunk)=>{
                        sourceSocket.end()
                    })
                })
                serverSocket.listen(tcpServer.port,localhost,()=>{
                    global.logger.info(`tcp proxy[${tcpServer.host}:${tcpServer.target_port}] server is running on port [${localhost}:${tcpServer.port}]`);
                    resolve(serverSocket)
                })
            }else{
                global.logger.error(`${localhost}端口${tcpServer.port}已被其他服务占用，代理无法启动`);
                resolve(null)
            }
        }catch (error){
            global.logger.error(`Error starting tcp proxy[${localhost}:${tcpServer.host}] server:`, error);
            resolve(null)
        }
    })
}
function initBeat(){
    global.worker =  new Worker(path.resolve(__dirname, '../../works/heartBeat.js'))
    global.worker.on('message',(result)=>{
        switch (result.type){
            case 'pidIsNull':{
                // xgrok进程死了
                break;
            }
        }
    })
}
function startBeat(pid,webServers,tcpServers){
    global.worker.postMessage({
        type:'start',
        data:{pid, webServers,tcpServers}
    })
}
function stopBeat(){
    global.worker.postMessage({
        type:'stop'
    })
}

module.exports = {
    turnOn,
    turnOff,
    setXY,
    minWindow,
    maxWindow,
    closeWindow,
    openExternal,
    hiddenWindow
}