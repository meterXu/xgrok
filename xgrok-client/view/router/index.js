import {createRouter, createWebHashHistory} from "vue-router";
import {initWebSocket} from "@/api";
import webSocketHandler from "@/libs/webSocketHandler";
import Login from "@/pages/Login.vue"
import Register from "@/pages/Register.vue";
import ForgotPassword from '@/pages/ForgotPassword.vue'
import Error from '@/pages/Error.vue'
import Index from '@/pages/Index.vue'
import Dashboard from "@/pages/dashboard/Dashboard.vue";
import WebTunnelPage from "@/pages/web/TunnelPage.vue"
import ServiceTunnelPage from '@/pages/service/TunnelPage.vue'
import Plan from "@/pages/plan/Plan.vue"
import Log from "@/pages/log/Log.vue"
import About from "@/pages/about/About.vue"
import Order from "@/pages/order/Order.vue"
import Setting from "@/pages/setting/Setting.vue"

const normalRoutes = [
    {
        path: "/login",
        name: 'Login',
        component: Login,
    },
    {
        path: "/register",
        name: 'Register',
        component: Register,
        meta: {
            requireAuth: false
        }
    },
    {
        path: "/forgotPassword",
        name: 'ForgotPassword',
        component: ForgotPassword,
        meta: {
            requireAuth: false
        }
    },
    {
        path: "/error/404",
        name: '404',
        component: Error,
    },
    {
        path: "/error/403",
        name: '403',
        component: Error,
    },
    {
        path: "/",
        name: 'Main',
        redirect: '/client',
    },
    {
        path: "/client",
        name: 'Client',
        component: Index,
        redirect: "/client/dashboard",
        children: [
            {
                path: 'dashboard',
                name: 'Dashboard',
                component: Dashboard,
                meta: {
                    title: '首页',
                }
            },
            {
                path: 'web',
                name: 'Web',
                component: WebTunnelPage,
                meta: {
                    title: '网页',
                }
            },
            {
                path: 'service',
                name: 'Service',
                component: ServiceTunnelPage,
                meta: {
                    title: '服务',
                }
            },
            // {
            //     path: 'vpn',
            //     name: 'Vpn',
            //     component: ServiceTunnelPage,
            //     meta: {
            //         title: '直联',
            //     }
            // },
            {
                path: 'plan',
                name: 'Plan',
                component: Plan,
                meta: {
                    title: '订阅',
                }
            },
            {
                path: 'log',
                name: 'Log',
                component: Log,
                meta: {
                    title: '日志',
                }
            },
            {
                path: 'about',
                name: 'About',
                component: About,
                meta: {
                    title: '关于',
                }
            },
            {
                path: 'order/:productId/:payNum',
                name: 'Order',
                props: true,
                component: Order,
            },
            {
                path: 'setting',
                name: 'Setting',
                component: Setting,
                meta: {
                    title: '设置',
                }
            }
        ]
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: Login
    }
]

const router = createRouter({
    scrollBehavior: () => ({
        y: 0
    }),
    history: createWebHashHistory(),
    routes: normalRoutes
});
window.router = router;
router.beforeEach((to, from, next) => {
    if (to.name !== 'Login' || !window.ws) {
        initWebSocket(webSocketHandler)
    }
    next()
})

export default router;

