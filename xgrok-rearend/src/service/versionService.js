import config from '../config.js'
import axios from "axios";
import packages from '../../package.json';
let releases = []
let defaultReleases = {
    tag_name:packages.version,
    created_at:'',
    body:''
}
export default class VersionService {
    constructor() {
    }
    async latest(){
        return new Promise((resolve, reject)=>{
            if(releases.length===0) {
                axios.get(config.github_api_url+'/releases').then((res) => {
                    if(res.status === 200) {
                        if(res.data.length > 0){
                            releases = res.data
                            resolve(releases[0])
                        }else{
                            resolve(defaultReleases)
                        }
                    }
                }).catch(()=>{
                    resolve(defaultReleases)
                })
            }else{
                resolve(releases[0])
            }
        })

    }

    async list(){
        return new Promise((resolve, reject)=>{
            if(releases.length===0){
                axios.get(config.github_api_url+'/releases').then((res) => {
                    if(res.status === 200) {
                        if(res.data.length > 0){
                            releases = res.data
                        }
                        resolve(releases)
                    }
                }).catch(()=>{
                    resolve(releases)
                })
            }else{
                return(releases)
            }
        })

    }
}
