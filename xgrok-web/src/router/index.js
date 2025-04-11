import {createRouter,createWebHashHistory} from "vue-router";
import {defineAsyncComponent} from 'vue'

const normalRoutes = [
    {
        path: "/xg/login",
        name: "login",
        component:defineAsyncComponent(()=>import("../pages/Login.vue"))
    },
    {
        path: "/xg/error/404",
        name: "MyNotFound",
        component: defineAsyncComponent(()=>import("../pages/error/MyNotFound.vue")),
    },
    {
        path: "/xg/error/403",
        name: "MyNoAuthority",
        component: defineAsyncComponent(()=>import("../pages/error/MyNoAuthority.vue"))
    },
    {
        path: "/",
        component: defineAsyncComponent(()=>import("../pages/Main.vue")),
        name: 'Main',
        redirect:"/xg/dashboard",
        children: [{
            path:'/xg/dashboard',
            name:'Dashboard',
            component:defineAsyncComponent(()=>import("../pages/views/Dashboard.vue")),
        }]
    }
]

const router = createRouter({
    scrollBehavior: () => ({
        y: 0
    }),
    history:createWebHashHistory(),
    routes: normalRoutes
});

export default router;

