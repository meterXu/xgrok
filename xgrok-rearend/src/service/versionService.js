import config from '../config.js'
import axios from "axios";
export default class VersionService {
    constructor() {
    }
    async latest(){
        return new Promise((resolve, reject)=>{
            axios.get(config.github_api_url+'/releases').then((res) => {
                if(res.status === 200&&res.data.length > 0) {
                    resolve(res.data[0])
                }
            })
        })

    }

    async list(){
        return new Promise((resolve, reject)=>{
            axios.get(config.github_api_url+'/releases').then((res) => {
                if(res.status === 200&&res.data.length > 0) {
                    resolve(res.data)
                }
            })
        })

    }
}
