import {createRouter, createWebHashHistory} from "vue-router";
import {initWebSocket} from "@/api";
import webSocketHandler from "@/libs/webSocketHandler";

const normalRoutes = [
    {
        path: "/login",
        name: 'Login',
        component: () => import("@/pages/Login.vue"),
    },
    {
        path: "/register",
        name: 'Register',
        component: () => import("@/pages/Register.vue"),
        meta: {
            requireAuth: false
        }
    },
    {
        path: "/forgotPassword",
        name: 'ForgotPassword',
        component: () => import("@/pages/ForgotPassword.vue"),
        meta: {
            requireAuth: false
        }
    },
    {
        path: "/error/404",
        name: '404',
        component: () => import("@/pages/Error.vue"),
    },
    {
        path: "/error/403",
        name: '403',
        component: () => import("@/pages/Error.vue"),
    },
    {
        path: "/",
        name: 'Main',
        redirect: '/client',
    },
    {
        path: "/client",
        name: 'Client',
        component: () => import("@/pages/Index.vue"),
        redirect: "/client/dashboard",
        children: [
            {
                path: 'dashboard',
                name: 'Dashboard',
                component: () => import("@/pages/dashboard/Dashboard.vue"),
                meta: {
                    title: '首页',
                }
            },
            {
                path: 'web',
                name: 'Web',
                component: () => import("@/pages/web/TunnelPage.vue"),
                meta: {
                    title: '网页',
                }
            },
            {
                path: 'service',
                name: 'Service',
                component: () => import("@/pages/service/TunnelPage.vue"),
                meta: {
                    title: '服务',
                }
            },
            {
                path: 'plan',
                name: 'Plan',
                component: () => import("@/pages/plan/Plan.vue"),
                meta: {
                    title: '订阅',
                }
            },
            {
                path: 'log',
                name: 'Log',
                component: () => import("@/pages/log/Log.vue"),
                meta: {
                    title: '日志',
                }
            },
            {
                path: 'about',
                name: 'About',
                component: () => import("@/pages/about/About.vue"),
                meta: {
                    title: '关于',
                }
            },
            {
                path: 'order/:productId/:payNum',
                name: 'Order',
                props: true,
                component: () => import("@/pages/order/Order.vue"),
            },
            {
                path: 'setting',
                name: 'Setting',
                component: () => import("@/pages/setting/Setting.vue"),
                meta: {
                    title: '设置',
                }
            }
        ]
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import("@/pages/Login.vue")
    }
]

const router = createRouter({
    scrollBehavior: () => ({
        y: 0
    }),
    history: createWebHashHistory(),
    routes: normalRoutes
});

router.beforeEach((to, from, next) => {
    if (to.name !== 'Login' || !window.ws) {
        initWebSocket(webSocketHandler)
    }
    next()
})

export default router;

