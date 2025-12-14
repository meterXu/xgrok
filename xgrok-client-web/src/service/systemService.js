import os from "node:os";

export default class SystemService {
    constructor() {
    }

    getSystemInfo(){
        return {
            hostname:os.hostname(),
            osVersion:os.version()
        }
    }
}
