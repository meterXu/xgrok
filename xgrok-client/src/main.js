const { app, BrowserWindow,Tray,Menu,nativeImage } = require('electron')
const getProject = require("./project");
const path = require('node:path')
const logger  = require('electron-log')

logger.initialize()
global.logger=logger
const project = getProject(app,process.env.NODE_ENV)
global.project = project
require('./rpc/backend')
const {killPid, findProcessId} = require("./libs/util");
const appName = project.appName
global.logger.info(`程序启动`)

let requireClose = false
const createWindow = () => {
    const trayIcon = nativeImage.createFromPath(project.trayIcon[process.platform])
    const appIcon = nativeImage.createFromPath(project.appIcon[process.platform])
    const win = new BrowserWindow(Object.assign(Object.assign({
        title:appName,
        width: 1000,
        height: 800,
        icon: appIcon,
        webPreferences: {
            preload: path.join(__dirname,'rpc', 'preload.js'),
            nodeIntegration: false // 禁用 Node.js 集成
        }
    },process.platform!=='darwin'?{
        titleBarStyle: 'customButtonsOnHover',
        titleBarOverlay: true,
        frame:false
    }:null )))
    process.env.NODE_ENV==='development'?win.loadURL(project.viewUrl):win.loadFile(project.viewUrl)
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
            label: '退出',
            click: () => {
                global.logger.info(`tray exit app`)
                win.webContents.send('appQuit')
                app.quit();
            }
        }
    ]);

    tray.setToolTip(appName);
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
            win.webContents.send('appQuit')
            app.quit()
        }
    })
    app.on('before-quit',async ()=>{
        global.logger.info('app will quit')
        requireClose = true
        global.logger.info(`kill xgrok,pid is ${global.xgrokPid}`)
        global.xgrokPid && await killPid(global.xgrokPid)
        global.win.webContents.send('appQuit')
    })
    app.whenReady().then(async () => {
        Menu.setApplicationMenu(null) // null值取消顶部菜单栏
        createWindow()
    })
}