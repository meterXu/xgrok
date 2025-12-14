import os from "node:os";
import fs from "node:fs";
import {execFile} from "node:child_process";
import {hostType} from "../libs/enum.js";
import http from "http";

export default class SystemService {
    constructor() {
        this._xgrokConf = null
        this.pid = null
        this.serviceNames = null
    }

    getSystemInfo(){
        return {
            hostname:os.hostname(),
            osVersion:os.version()
        }
    }

    async turnOn(xgrokConf) {
        try {
            this._xgrokConf = xgrokConf
            const webServers = []
            const tcpServers = []
            if (xgrokConf.tunnelWebs.length === 0 && xgrokConf.tunnelServices.length === 0) {
                return Promise.reject({message: '配置为空'})
            } else {
                await this.saveYamlConf(xgrokConf.server, xgrokConf.tunnelWebs, xgrokConf.tunnelServices)
                this.serviceNames = xgrokConf.tunnelWebs.map(c => c.name).concat(xgrokConf.tunnelServices.map(c => c.name))
                let proxyWebs = xgrokConf.tunnelWebs.filter(c => c.is_remote === hostType.remote)
                if (proxyWebs.length > 0) {
                    webServers.push(...await this.startWebProxy(proxyWebs))
                }
                this.pid = await this.startXgrok(this.serviceNames,xgrokConf.server.type)
                console.log(`xgrok pid is [${this.pid}]`)
                let runStatus = await this.getTunnelStatus([...xgrokConf.tunnelWebs||[],...xgrokConf.tunnelServices||[]])
                console.log(`xgrok tunnels status: ${JSON.stringify(runStatus)}`)
                if(runStatus.length === 0) {
                    return Promise.resolve({
                        pid:this.pid,
                        message:'隧道启动成功'
                    })
                }else{
                    await this.turnOff(this.pid)
                    return Promise.resolve({
                        pid:0,
                        message:runStatus.join('<br/>')
                    })
                }
            }
        } catch (err) {
            this.pid&&await this.turnOff(this.pid)
            return Promise.reject({message: err.message})
        }
    }

    async  turnOff(pid) {
        console.log(`kill xgrok,pid is ${pid}`)
        fs.existsSync(global.project.xgrokCoreCfgPath) && fs.unlinkSync(global.project.xgrokCoreCfgPath)
        stopBeat()
        let res = null
        if (pid) {
            res = await killPid(pid)
        } else {
            let pids = await findProcessId('xgrok-core')
            let ress = await Promise.all(pids.map(c => killPid(c)))
            res = !ress.some(c => c.false)
        }
        global.win.webContents.send('view/process', 0)
        return res
    }

    getLog(){

    }





    async getTunnelStatus(tunnels){
        return new Promise(async (resolve, reject) => {
            try{
                let isRun = await waitPortRun(global.project.webServer.port,global.project.webServer.addr)
                if(isRun){
                    await login()
                    let statusData = (await apiStatus()).data
                    statusData = [...statusData.tcp||[],...statusData.udp||[],...statusData.http||[]]
                    let errArray=[]
                    let step=0
                    const loopCheck = async (c)=>{
                        if(step===3){//3s后仍未检测到结果则视为启动成功
                            return
                        }
                        step++
                        let findStatus = statusData.find(r=>r.name===c.name)
                        if(findStatus?.status==='wait start'){
                            await sleep(1000)
                            statusData = (await apiStatus()).data
                            statusData = [...statusData.tcp||[],...statusData.udp||[],...statusData.http||[]]
                            await loopCheck(c)
                        }
                        if(findStatus?.status.indexOf('error')>-1){
                            errArray.push(`${c.name}启动失败，${findStatus?.err||'-'}`)
                        }
                    }
                    for(let c of tunnels){
                        await loopCheck(c)
                    }
                    resolve(errArray)
                }else{
                    resolve(['无法获取隧道状态'])
                }
            }catch (err){
                reject(err)
            }
        })
    }

    startXgrok(names,type) {
        return new Promise(async (resolve, reject) => {
            global.logger.info(`os arch: ${arch()}`)
            global.logger.info(`os platform: ${platform()}`)
            global.logger.info(`start xgrok, the client root path is ${global.project.clientRootPath}`)
            if(process.env.NODE_ENV==='development'){
                global.logger.info(`config:\r\n${readXgrokCfgFile(global.project.xgrokCoreCfgPath)}`)
            }
            let xgrok = null
            if(type===serverType.ngrok){
                xgrok = execFile('./xgrok-core', [`-config=${global.project.xgrokCoreCfgPath}`, 'start', ...names], {
                    cwd: global.project.clientRootPath,
                    detached: true
                }, (error, stdout, stderr) => {
                    if (error) {
                        global.logger.error(error)
                    }
                })
            }else{
                xgrok = execFile('./xgrok-core', ['-c',`${global.project.xgrokCoreCfgPath}`], {
                    cwd: global.project.clientRootPath,
                    detached: true
                }, (error, stdout, stderr) => {
                    if (error.signal!=='SIGTERM' && error) {
                        global.logger.error(error)
                    }
                })
            }
            xgrok.on('close', (data) => {
                return Promise.resolve({success: true, message: '关闭成功'})
            });
            resolve(xgrok.pid)
        })

    }

    async saveYamlConf(serverDetail, webDetails, serviceDetails) {
        const yamlConf = await generateXgrokConf(serverDetail, webDetails, serviceDetails)
        fs.writeFileSync(global.project.xgrokCoreCfgPath, yamlConf);

    }

    async generateXgrokConf(serverDetail, WebDetails, serviceDetails) {
        if (serverDetails.type === serverType.ngrok) {
            let webTunnels = WebDetails.map(web => {
                return {[web.name]: {proto: {http: web.port}}}
            })
            let serviceTunnels = serviceDetails.map(service => {
                return {
                    [service.name]: {
                        remote_port: service.remote_port,
                        proto: {
                            [[null, 'tcp', 'udp'][serviceType.tcp]]: service.port
                        }
                    }
                }
            })
            const yamlConf = {
                server_addr: `${serverDetail.domain}:${serverDetail.port}`,
                trust_host_root_certs: false,
                tunnels: {}
            }
            webTunnels.forEach(web => {
                const we = Object.entries(web)
                yamlConf.tunnels[we[0][0]] = we[0][1]
            })
            serviceTunnels.forEach(service => {
                const se = Object.entries(service)
                yamlConf.tunnels[se[0][0]] = se[0][1]
            })
            return stringify(yamlConf)
        } else {
            const config = {
                serverAddr: serverDetail.domain,
                serverPort: global.project.serverPort,
                auth: {
                    method: global.project.auth.method,
                    token: global.project.auth.token,
                },
                log:{
                    to:global.project.logPath
                },
                webServer:global.project.webServer,
                proxies: [...WebDetails.map(web => {
                    return {
                        name: web.name,
                        type: 'http',
                        localPort:web.port,
                        subdomain: web.name,
                        transport:{
                            bandwidthLimit:'25MB'
                        }
                    }
                }),
                    ...serviceDetails.map(service => {
                        return {
                            name:service.name,
                            type:getEnumKey(serviceType,service.type),
                            localIP:service.host,
                            localPort:service.port,
                            remotePort:service.remote_port,
                            transport:{
                                bandwidthLimit:'25MB'
                            }
                        }
                    })
                ]
            }
            config.webServer.port = await nextAvailable(global.project.startWebServerProt, global.project.webServer.addr)
            global.logger.info(`xgrok admin port start with [${global.project.startWebServerProt}],run with [${config.webServer.port}]`)
            return stringify(config)
        }
    }

    readXgrokCfgFile(xgrokCfgPath) {
        return fs.readFileSync(xgrokCfgPath, {encoding: 'utf-8'})
    }

    async startWebProxy(proxyWebs) {
        let webProxyArray = []
        for (let proxyWeb of proxyWebs) {
            const proxy = httpProxy.createProxyServer({
                changeOrigin: true,
                secure: false,
            });
            const webServer = http.createServer((req, res) => {
                proxy.web(req, res, {target: proxyWeb.host, ignorePath: false}, (error) => {
                    global.logger.error(`web proxy[${proxyWeb.host}] error:`, error);
                    res.writeHead(500, {'Content-Type': 'text/plain'});
                    res.end(`web proxy[${proxyWeb.host}] error:${error.message || 'Internal Server Error'}`);
                })
            })
            // 处理 WebSocket 请求
            webServer.on('upgrade', (req, socket, head) => {
                const target = proxyWeb.host
                proxy.ws(req, socket, head, {target: target});
            });
            let res = await startWebServer(webServer, proxyWeb)
            if (res) {
                webProxyArray.push({tunnelConfig: proxyWeb, proxyServer: res})
            }
        }
        return webProxyArray
    }
}
