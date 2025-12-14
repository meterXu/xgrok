import {getSystemInfo} from '../../../xgrok-client/src/libs/backend/system.js'
import {turnOn,turnOff} from '../../../xgrok-client/src/libs/backend/xgrok.js'
export default class SystemService {
    constructor() {
    }

    getSystemInfo(){
        return getSystemInfo()
    }

    turnOn(xgrokConf) {
        return turnOn(xgrokConf)
    }

    turnOff(pid) {
        return turnOff(pid)
    }

    getLog(){

    }
}
