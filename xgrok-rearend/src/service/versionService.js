import config from '../config.js'
import axios from "axios";
import packages from '../../package.json';
export default class VersionService {
    constructor() {
        this.releases = []
        this.defaultReleases = {
            tag_name:packages.version,
            created_at:'',
            body:''
        }
    }
    async latest(){
        return new Promise((resolve, reject)=>{
            if(this.releases.length===0) {
                axios.get(config.github_api_url+'/releases').then((res) => {
                    if(res.status === 200) {
                        if(res.data.length > 0){
                            this.releases = res.data
                            resolve(this.releases[0])
                        }else{
                            resolve(this.defaultReleases)
                        }
                    }
                }).catch(()=>{
                    resolve(this.defaultReleases)
                })
            }else{
                resolve(this.releases[0])
            }
        })

    }

    async list(){
        return new Promise((resolve, reject)=>{
            if(this.releases.length===0){
                axios.get(config.github_api_url+'/releases').then((res) => {
                    if(res.status === 200) {
                        if(res.data.length > 0){
                            this.releases = res.data
                        }
                        resolve(this.releases)
                    }
                }).catch(()=>{
                    resolve(this.releases)
                })
            }else{
                return(this.releases)
            }
        })

    }
}
