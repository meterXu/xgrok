interface ProjectType {
    nameSpace: string,
    variable: {
        tokenKey: string,
        appCode: string,
        minioUrl: string,
        baseUrl: string,
        runLogWsUrl: string,
        mapStyleUrl: string
    },
    redirect: { index: string, login: string, "404": string, '403': string },
    style: { theme: string, layout: string, multiPage: boolean },
    config: {
        logo: string,
        favicon: string,
        title: string,
        login: { title: string, desc: string, },
        menu: { mode: string },
        head: {
            hamburger: boolean,
            logo: { show: boolean, },
            title: { show: boolean, desktop: string, mobile: string },
            breadcrumb: { show: boolean, },
            searchMenu: { show: boolean },
            helper: { show: boolean, href: string, target: string },
            fullscreen: { show: boolean, },
            user: {
                show: boolean,
                username: boolean,
                menu: { show: boolean, clearCache: boolean, changePwd: boolean, exitSystem: boolean }
            }
        },
        sideMenu: {
            title: string,
            width: string,
            logo: { show: boolean, },
            hamburger: boolean,
            user: {
                show: boolean,
                username: boolean,
                tag: boolean,
                menu: { show: boolean, clearCache: boolean, changePwd: boolean, exitSystem: boolean }
            }
        },
        tabs: { show: boolean, icon: boolean },
        footer: {
            show: boolean,
            links: any[],
            copyright: { content: string, year: number, href: string, target: string }
        },
        plugins: object
    }
}
