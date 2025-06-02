import {createRouter, createWebHistory} from 'vue-router';
const routes: Array<any> = [
    {
        path: '/login',
        name: 'Login',
        component: ()=>import('../views/Login.vue'),
    },
    {
        path: '/',
        name: 'Home',
        component: ()=>import('../views/Index.vue'),
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
