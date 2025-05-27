const http  = require('node:http');
const net = require('node:net')
const os  = require('node:os')
const fs = require("fs");
const path = require("path");
const { exec } = require('child_process');
function randomNumber() {
    const random = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }
    if (arguments.length === 1) {
        let [length] = arguments
        let nums = [...Array(length).keys()].map((i) => (i > 0 ? random(0, 9) : random(1, 9)))
        return parseInt(nums.join(''))
    } else if (arguments.length >= 2) {
        let [min, max] = arguments
        return random(min, max)
    } else {
        return Number.NaN
    }
}
function randomString(length = 1, chats = '0123456789qwertyuioplkjhgfdsazxcvbnm') {
    let str = ''
    for (let i = 0; i < length; i++) {
        let num = randomNumber(0, chats.length - 1)
        str += chats[num]
    }
    return str
}
function randomUUID(isFull=false) {
    const chats= isFull?undefined:'0123456789abcdef'
    return randomString(32, chats)
}
function isNullOrUndefined(value){
    return value===undefined||value===null
}
// 删除进程
function killPid(pid){
    return new Promise((resolve, reject) => {
        if(checkProcess(pid)){
            process.kill(pid, 'SIGTERM');
        }
        setTimeout(()=>{
            resolve(!checkProcess(pid))
        },1000)
        closeAllWebServer(global.webServers)
        closeAllTcpServer(global.tcpServers)
    })
}
function checkProcess(pid){
    try {
        process.kill(pid, 0); // 发送信号 0，不会终止进程，但可以用来检查进程是否存在
        console.log(`${new Date()} 进程 ${pid} 存在。`);
        return true
    } catch (e) {
        if (e.code === 'ESRCH') {
            console.log(`${new Date()} 进程 ${pid} 不存在。`);
        } else {
            console.log(`${new Date()} 无法检查进程 ${pid}，错误代码：${e.code}`);
        }
        return false
    }
}
// 获取操作系统类型、
// "darwin" - darwin
// "linux" - Linux
// "win32" - Windows
function platform(){
    return os.platform()
}
function arch(){
    return os.arch()
}
function hostname(){
    return os.hostname()
}
function version(){
    return os.version()
}
function copyFolder(src, dest,callback) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest);
    }
    let items = fs.readdirSync(src);
    items.forEach(item => {
        let oldPath = path.join(src, item);
        let newPath = path.join(dest, item);

        if (fs.statSync(oldPath).isDirectory()) {
            // 如果是文件夹，递归
            copyFolder(oldPath, newPath,callback);
        } else {
            // 如果是文件，拷贝
            if(path.extname(oldPath) === '.js'){
                callback&&callback(oldPath,newPath)
            }else{
                fs.copyFileSync(oldPath, newPath);
            }
        }
    });
}
function closeAllWebServer(webServers){
    webServers?.forEach(webServer=>{
        webServer.proxyServer.close((error)=>{
            if(error){
                global.logger.error('Error closing web proxy:',error)
            }else{
                global.usedProxyPorts.splice(global.usedProxyPorts.findIndex(c=>c===webServer.tunnelConfig.target_port),1)
                global.logger.info('web proxy closed successfully')
            }
        })
    })
}
function closeAllTcpServer(tcpServers){
    tcpServers?.forEach(tcpServer=>{
        tcpServer.proxyServer.close((error)=>{
            if(error){
                global.logger.error('Error closing tcp proxy:',error)
            }else{
                global.usedProxyPorts.splice(global.usedProxyPorts.findIndex(c=>c===tcpServer.tunnelConfig.target_port),1)
                global.logger.info('tcp proxy closed successfully')
            }
        })
    })
}
function checkServerOnline(domain,port){
    return new Promise((resolve, reject) => {
        const socket = new net.Socket();
        socket.setTimeout(3000); // 设置超时时间，根据需要调整
        socket.once('connect', () => {
            socket.destroy();
            console.log(`${new Date()} 端口 ${port} 在 ${domain} 上被占用。`);
            resolve(true)
        });
        socket.once('timeout', () => {
            console.log(`${new Date()} 连接到 ${domain}:${port} 超时。`);
            resolve(false)
            socket.destroy();
        });
        socket.once('error', (err) => {
            if (err.code === 'ECONNREFUSED') {
                resolve(false)
            } else {
                resolve(true)
                console.log(`${new Date()} 在检查端口时发生错误: ${err.message}`);
            }
        });
        socket.connect(port, domain);
    })
}
function checkUrl(name, domain, port, timeout=500) {
    const url = `http://${name}.${domain}:${port}/`
    new Promise((resolve) => {
        setTimeout(() =>  resolve(false), timeout);
    });
    return new Promise((resolve) => {
        http.get(url, (res) => {
            if (res.statusCode === 200) {
                console.log(`${new Date()} ${url} 可访问`);
                resolve(true);
            } else {
                console.log(`${new Date()} ${url} 不可访问`);
                resolve(false);
            }
        }).on('error', () => {
            console.log(`${new Date()} ${url} 请求错误`);
            resolve(false);
        });
    });
}
function findProcessId(processName) {
    return new Promise((resolve, reject) => {
        let command;
        // 根据操作系统选择命令
        if (os.platform() === 'win32') {
            // Windows 系统
            command = `tasklist | findstr ${processName}`;
        } else {
            // Unix/Linux 和 macOS
            command = `ps aux | grep ${processName} | grep -v grep`;
        }
        // 执行命令
        exec(command, (error, stdout, stderr) => {
            if (error) {
                return reject(`Error executing command: ${stderr}`);
            }
            const lines = stdout.trim().split('\n');
            const pids = lines.map(line => {
                // 提取 PID
                const columns = line.trim().split(/\s+/);
                return columns[1]; // 返回 PID
            }).filter(pid => pid); // 过滤可能的空值
            resolve(pids);
        });
    });
}
function checkUpdate(app,autoUpdater,dialog,checkUpdateUrl,platform){
    global.logger.info(`start check xgrok new version,now version is ${app.getVersion()}`)
    autoUpdater.logger = global.logger
    autoUpdater.forceDevUpdateConfig = true
    autoUpdater.checkForUpdates();
    // //监听发现可用更新事件
    // autoUpdater.on('update-available', (message) => {
    // })
    // //监听没有可用更新事件
    // autoUpdater.on('update-not-available', (message) => {
    // });
    //监听下载完成事件
    autoUpdater.on('update-downloaded',(releaseObj) => {
        global.logger.info(`${JSON.stringify(releaseObj)}`)
        global.logger.info(`a new version has been downloaded. Starta om applikationen for att verkstalla uppdateringarna`)
        const dialogOpts = {
            type: 'info',
            buttons: ['重启', '稍后'],
            title: '应用更新',
            detail: '新版本已下载，重新启动应用程序以执行更新。'
        }
        dialog.showMessageBox(dialogOpts).then((returnValue) => {
            if (returnValue.response === 0) autoUpdater.quitAndInstall()
        })
    });
}

module.exports = {
    randomNumber,
    randomString,
    randomUUID,
    isNullOrUndefined,
    checkProcess,
    killPid,
    platform,
    arch,
    hostname,
    version,
    copyFolder,
    findProcessId,
    checkServerOnline,
    checkUrl,
    checkUpdate
}