import {createRouter, createWebHashHistory} from 'vue-router';
const routes: Array<any> = [
    {
        path: '/login',
        name: 'Login',
        component: ()=>import('@/views/Login.vue'),
    },
    {
        path: '/',
        name: 'Index',
        component: ()=>import('@/views/Index.vue'),
        redirect:'/dashboard',
        children:[
            {
                path: '/dashboard',
                name: 'Dashboard',
                component: ()=>import('@/views/dashboard/Dashboard.vue'),
            },
            {
                path: '/user',
                name: 'UserList',
                component: ()=>import('@/views/user/UserList.vue'),
            },
            {
                path: '/order',
                name: 'OrderList',
                component: ()=>import('@/views/order/OrderList.vue'),
            },
            {
                path: '/server',
                name: 'ServerList',
                component: ()=>import('@/views/server/ServerList.vue'),
            }
        ]
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;
