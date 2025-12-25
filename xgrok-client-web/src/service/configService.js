import {getXgrokAppCfg,setXgrokAppCfg} from '../../../xgrok-client/src/libs/backend/system.js'
import fs from "node:fs";
export default class ConfigService{
    constructor() {
    }
    async getAppConfig(){
        if(!fs.existsSync(global.project.xgrokAppCfgPath)){
            fs.writeFileSync(global.project.xgrokAppCfgPath,JSON.stringify(global.project.appConf))
        }
        return getXgrokAppCfg()
    }
    async setAppConfig(configModel){
        return setXgrokAppCfg(configModel)
    }
}
