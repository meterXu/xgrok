const { app, BrowserWindow,Tray,Menu,nativeImage,dialog,shell } = require('electron')
const {autoUpdater} = require('electron-updater')
const getProject = require("./project");
const path = require('node:path')
const logger  = require('electron-log')

logger.initialize()
global.logger=logger
const project = getProject(app,process.env.NODE_ENV)
global.project = project
require('./ipc/backend')
const {killPid, findProcessId,checkUpdate} = require("./libs/util");
global.logger.info(`xgrok is running,version:${app.getVersion()}`)
global.proxyLocalhost = '127.0.0.1'

let requireClose = false
function createWindow () {
    const trayIcon = nativeImage.createFromPath(project.trayIcon[process.platform])
    const appIcon = nativeImage.createFromPath(project.appIcon[process.platform])
    const win = new BrowserWindow(Object.assign(Object.assign({
        title:app.getName(),
        width: 1000,
        height: 800,
        icon: appIcon,
        webPreferences: {
            preload: path.join(__dirname,'ipc', 'preload.js'),
            nodeIntegration: false // 禁用 Node.js 集成
        }
    },process.platform!=='darwin'?{
        titleBarStyle: 'customButtonsOnHover',
        titleBarOverlay: true,
        frame:false
    }:null )))
    if(process.env.NODE_ENV==='development'){
        setTimeout(async ()=>{
            await win.loadURL(project.viewUrl)
            win.webContents.openDevTools();
        },1000)
    }else{
        win.loadFile(project.viewUrl)
    }
    // 创建系统托盘图标
    const tray = new Tray(trayIcon);
    const contextMenu = Menu.buildFromTemplate([
        {
            label: '显示应用',
            click: () => {
                global.logger.info(`tray show app`)
                win.show();
            }
        },
        {
            label: '检查更新',
            click: () => {
                global.logger.info(`tray check update`)
                // 检查更新
                checkUpdate(app,autoUpdater,dialog,shell,true).then((info)=>{
                    win.webContents.send('view/foundNewVersion',info)
                }).catch(()=>{
                    dialog.showMessageBox({
                        type: 'info',
                        buttons: ['确定'],
                        title: '提示',
                        detail: '无可用更新，当前已是最新版本！'
                    })
                })
            }
        },
        {
            label: '退出',
            click: () => {
                global.logger.info(`tray exit app`)
                win.webContents.send('view/appQuit')
                app.quit();
            }
        }
    ]);

    tray.setToolTip(app.getName());
    tray.setContextMenu(contextMenu);
    tray.on('click', () => {
        global.logger.info(`tray click`)
        if(process.platform!=='darwin'){
            win.isVisible() ? win.hide() : win.show();
        }
    });
    // 监听关闭事件
    win.on('close', (event) => {
        global.logger.info(`win close, requireClose:${requireClose}`)
        if(requireClose){
            app.quit();
        }else{
            event.preventDefault();
            win.hide()
        }
    });
    // 检查更新
    checkUpdate(app,autoUpdater,dialog,shell).then((info)=>{
        win.webContents.send('view/foundNewVersion',info)
    })

    global.win = win
}

// 获取单实例锁
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
    // 如果无法获取锁，说明已有实例运行，当前实例应退出
    app.quit();
}else {
    findProcessId('compile').then(pids=>{
        pids&&pids.forEach(pid=>killPid(pid))
    })
    // 当运行第二个实例时, 将会聚焦到这个窗口
    app.on('second-instance', (event, commandLine, workingDirectory) => {
        // 在这里处理第二个实例的参数和工作目录
        if (global.win) {
            if(global.win.isMinimized()) global.win.restore();
            if(!global.win.isVisible()) global.win.show()
            global.win.focus();
        }
    });
    app.on('activate', () => {
        global.logger.info(`BrowserWindow.getAllWindows:${BrowserWindow.getAllWindows().length}`)
        if(process.platform !=='darwin'){
            if (BrowserWindow.getAllWindows().length === 0) createWindow()
        }else{
            if(!global.win.isVisible()){
                global.win.show()
            }
        }
    })
    app.on('window-all-closed', () => {
        global.logger.info(`window all closed`)
        if (process.platform !== 'darwin'){
            win.webContents.send('view/appQuit')
            app.quit()
        }
    })
    app.on('before-quit',async ()=>{
        global.logger.info('app will quit')
        requireClose = true
        global.logger.info(`kill xgrok,pid is ${global.xgrokPid}`)
        global.xgrokPid && await killPid(global.xgrokPid)
        global.win.webContents.send('view/appQuit')
    })
    app.whenReady().then(async () => {
        Menu.setApplicationMenu(null) // null值取消顶部菜单栏
        createWindow()
    })
}