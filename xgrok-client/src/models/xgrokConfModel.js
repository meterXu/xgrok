const serverModel = require('./serverModel')
const tunnelWebModel = require('./tunnelWebModel')
const tunnelServiceModel = require('./tunnelServiceModel')

class xgrokConfModel {
    constructor(xgrokConf) {
        this.server = new serverModel(xgrokConf.server)
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
        for(let i=0;i<this.tunnelServices.length;i++){
            await this.tunnelServices[i].exchangePort()
        }
    }
}
module.exports = xgrokConfModel