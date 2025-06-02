import {loadEnv}  from 'vite'
export default function (mode:string){
    const env = loadEnv(mode,process.cwd())
    return {
        nameSpace: "xgrok-rearend-manage",
        variable: {
            baseApi: env.VITE_APP_baseApi,
            tokenKey: env.VITE_APP_tokenKey
        },
        redirect: {
            index: "/dashboard",
            login: "/login",
            404: "/error/404",
            403: "/error/403",
        },
        style: {
            theme: 'vue-admin',
            layout: 'sideMenu',
            multiPage: true,
            fixSideMenu: false,
        },
        config:{
            logo: './assets/img/icon.png',
            sideMenu:{
                title:'xgrok后台管理',
                width: '300px',
            }
        }
    }
}
