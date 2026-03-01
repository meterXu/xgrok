import {getSystemInfo,getLog,getXgrokAppCfg,setXgrokAppCfg,checkWeb,checkPort} from '../../../xgrok-client/src/libs/backend/system.js'
import {turnOn,turnOff} from '../../../xgrok-client/src/libs/backend/xgrok.js'
export default class SystemService {
    constructor() {
    }

    async getSystemInfo(){
        const appCfg = getXgrokAppCfg()
        const systemInfo = await getSystemInfo()
        // 获取系统信息时初始化设备唯一ID
        if(appCfg.device_id){
            systemInfo.device_id = appCfg.device_id
        }else{
            appCfg.device_id = systemInfo.device_id
            setXgrokAppCfg(appCfg)
        }
        return systemInfo
    }

    turnOn(xgrokConf) {
        return turnOn(xgrokConf)
    }

    turnOff(pid) {
        return turnOff(pid)
    }

    getLog(logModel){
        return getLog(logModel)
    }

    checkWeb(name, domain, port){
        return checkWeb({name, domain, port})
    }

    checkService(domain, port, type){
        return checkPort(domain, port, type)
    }
}
