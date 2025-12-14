import {getXgrokAppCfg,setXgrokAppCfg} from '../../../xgrok-client/src/libs/backend/system.js'
export default class ConfigService{
    constructor() {
    }
    async getAppConfig(){
        return getXgrokAppCfg()
    }
    async setAppConfig(configModel){
        return setXgrokAppCfg(configModel)
    }
}
