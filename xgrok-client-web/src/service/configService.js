import fs from "node:fs/promises";

export default class ConfigService{
    constructor() {
    }
    async getAppConfig(){
        let config = null
        try{
            await fs.access(global.appConfig.appCfgPath)
            config = await fs.readFile(global.appConfig.appCfgPath)
        }catch (err){
            await fs.writeFile(global.appConfig.appCfgPath,JSON.stringify(global.appConfig.appConf,null,2))
        }
        return config?JSON.parse(config):global.appConfig.appConf
    }
    async setAppConfig(configModel){
        await fs.writeFile(global.appConfig.appCfgPath,JSON.stringify(configModel,null,2))
    }
}
