const {hostType} = require("../libs/enum");
const {randomGetPort} = require("../libs/backend/system");

class TunnelWebModel {
    constructor(body) {
        this.id = body.id
        this.server_id = body.server_id
        this.name = body.name
        this.host = body.host
        this.type = body.type
        this.port = body.port
        this.target_port = null
        this.sort = body.sort
        this.creator = body.creator
        this.editor = body.editor
        this.created_time = body.created_time
        this.modified_time = body.modified_time
        this.status = body.status
        this.is_delete = body.is_delete
        this.is_remote = body.is_remote
    }

    async exchangePort(){
        if(this.is_remote===hostType.remote){
            this.target_port = this.port
            this.port = await randomGetPort()
        }
    }
}
module.exports = TunnelWebModel