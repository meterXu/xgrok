import dotenv from 'dotenv'
import path from 'path'
dotenv.config({
    path: path.resolve(`.env.${(process.env.NODE_ENV||'development').trim()}`)
})
export function load(){
    return new Promise((resolve,reject)=>{
        const baseApi = process.env.VITE_APP_baseApi
        fetch(`${baseApi}/version/latest`).then(res => res.json()).then((data) => {
           return resolve({
               version:data.name?.replace(/^v/gi,'')
           })
        }).catch(err=>{
            reject(err)
        })
    })

}
