export function load(){
    return new Promise((resolve,reject)=>{
        const baseApi = import.meta.env.VITE_APP_baseApi
        fetch(`${baseApi}/version/latest`).then(res => res.json()).then((data) => {
           return resolve({
               version:data.name?.replace(/^v/gi,'')
           })
        }).catch(err=>{
            reject(err)
        })
    })

}
