import {createRouter,createWebHashHistory} from "vue-router";
import {initWebSocket} from "@/api";
import webSocketHandler from "@/libs/webSocketHandler";

const normalRoutes = [
    {
        path: "/login",
        name: 'Login',
        component:()=>import("../pages/Login.vue"),
    },
    {
        path: "/register",
        name: 'Register',
        component:()=>import("../pages/Register.vue"),
        meta:{
            requireAuth:false
        }
    },
    {
        path: "/forgotPassword",
        name: 'ForgotPassword',
        component:()=>import("../pages/ForgotPassword.vue"),
        meta:{
            requireAuth:false
        }
    },
    {
        path: "/error/404",
        name: '404',
        component:()=>import("../pages/Error.vue"),
    },
    {
        path: "/error/403",
        name: '403',
        component:()=>import("../pages/Error.vue"),
    },
    {
        path: "/",
        name: 'Main',
        component:()=>import("../pages/Index.vue"),
        redirect:"/client/dashboard",
        children: [
            {
                path:'/client/dashboard',
                name:'Dashboard',
                component:()=>import("../pages/dashboard/Dashboard.vue"),
            },
            {
                path:'/client/plan',
                name:'Plan',
                component:()=>import("../pages/plan/Plan.vue"),
            },
            {
                path:'/client/order/:productId/:payNum',
                name:'Order',
                props:true,
                component:()=>import("../pages/order/Order.vue"),
            }
      ]
    }
]

const router = createRouter({
    scrollBehavior: () => ({
        y: 0
    }),
    history:createWebHashHistory(),
    routes: normalRoutes
});

router.beforeEach((to, from, next)=>{
    if(to.name!=='Login'||!window.ws){
        initWebSocket(webSocketHandler)
    }
    next()
})

export default router;

