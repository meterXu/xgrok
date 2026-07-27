const {hostType} = require("../libs/enum");
const {randomGetPort} = require("../libs/backend/system");

class TunnelWebModel {
    constructor(body) {
        Object.assign(this, body);
        this.is_real=body.is_real??1
    }

    async exchangePort(){
        if(this.is_remote===hostType.remote){
            this.target_port = this.port
            this.port = await randomGetPort()
        }
    }
}
module.exports = TunnelWebModel
