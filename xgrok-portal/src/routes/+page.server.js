import dotenv from 'dotenv'
import path from 'path'
dotenv.config({
    path: path.resolve(`.env.${(process.env.NODE_ENV||'development').trim()}`)
})
export function load(){
    return new Promise((resolve,reject)=>{
        const baseApi = process.env.VITE_APP_baseApi
        const oss = process.env.VITE_APP_oss
        fetch(`${baseApi}/version/latest`).then(res => res.json()).then((data) => {
           return resolve({
               oss:oss,
               version:data.tag_name?.replace(/^v/gi,'')
           })
        }).catch(err=>{
            reject(err)
        })
    })

}
