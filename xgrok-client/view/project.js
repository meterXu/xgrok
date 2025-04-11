const {loadEnv} = require("vite");
const project = function (mode) {
    const env = loadEnv(mode,process.cwd())
    return {
        namespace: "xgrok_client",
        mainSys:true,
        index:10,
        variable: {
            mode: env.VITE_APP_mode,
            appId: env.VITE_APP_appId,
            appName: env.VITE_APP_appName,
            baseApi: env.VITE_APP_baseApi,
            ssoApi: env.VITE_APP_ssoApi,
            tokenKey: env.VITE_APP_tokenKey,
            wsUrl:env.VITE_APP_wsUrl,
            website:env.VITE_APP_website
        },
        redirect: {
            index: "/client/dashboard",
            login: "/login",
            404: "/error/404",
            403: "/error/403",
        },
        style: {
            theme: 'wdp',
            color: '#1890FF',
            layout: 'topmenu',
            multipage: true,
            fixSideMenu: false
        },
        config: {
            logo: "./static/imgs/logo.svg",
            login: {
                title: "xgrok-web",
                desc: ""
            },
            menu:{
                mode:'router'
            },
            head: {
                hamburger:false,
                logo:{
                    show: true,
                },
                title: {
                    show: false,
                    desktop: "",
                    mobile: ""
                },
                breadcrumb: {
                    show: false,
                },
                searchMenu: {
                    show: false
                },
                helper: {
                    show: false,
                    href: "javascript:;",
                    target: "_blank"
                },
                fullscreen: {
                    show: false,
                },
                user: {
                    show: true,
                    username: true,
                    menu: {
                        show: true,
                        clearCache: true,
                        changePwd: true,
                        exitSystem: true
                    }
                }
            },
            sideMenu: {
                title: "xgrok_client",
                width: '250px',
                logo:{
                    show: true,
                },
                hamburger:true,
                user: {
                    show: true,
                    username: true,
                    tag:true,
                    menu: {
                        show: true,
                        clearCache: true,
                        changePwd: true,
                        exitSystem: true
                    }
                }
            },
            tabs: {
                show: false,
                icon: true
            },
            footer: {
                show: false,
                links: [{
                    name: "帮助",
                    href: "javascript:;",
                    target: "_self",
                },
                    {
                        name: "隐私",
                        href: "javascript:;",
                        target: "_self",
                    },
                    {
                        name: "条款",
                        href: "javascript:;",
                        target: "_self",
                    }],
                copyright: {
                    content: "",
                    year: "",
                    href: "",
                    target: "_blank"
                }
            }
        }
    }
}

module.exports = project;
