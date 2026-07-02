const tunnelWebModel = require('./tunnelWebModel')
const tunnelServiceModel = require('./tunnelServiceModel')

class xgrokConfModel {
    constructor(xgrokConf) {
        this.pid = xgrokConf.pid;
        this.server = xgrokConf.server
        this.tunnelWebs = xgrokConf.tunnelWebs.map(c=>{
            return new tunnelWebModel(c)
        })
        this.tunnelServices = xgrokConf.tunnelServices.map(c=>{
            return new tunnelServiceModel(c)
        })
    }

    async exchangePorts(){
        for(let i=0;i<this.tunnelWebs.length;i++){
            await this.tunnelWebs[i].exchangePort()
        }
    }
}
module.exports = xgrokConfModel
