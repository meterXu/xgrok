import {getSystemInfo} from '../../../xgrok-client/src/libs/backend/system.js'
import {turnOn} from '../../../xgrok-client/src/libs/backend/xgrok.js'
export default class SystemService {
    constructor() {
    }

    getSystemInfo(){
        return getSystemInfo()
    }

    async turnOn(xgrokConf) {
        await turnOn(xgrokConf)
    }

    async  turnOff(pid) {

    }

    getLog(){

    }
}
