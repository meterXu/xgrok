import { createApp } from 'vue'
import App from './App.vue'
import XXWebBox from 'xxweb-box'
import {filter,type FilterCallbacks} from 'xxweb-util'
import {Ls} from 'xxweb-util'
import router from './router';
import store from "@/store";
import '@/assets/css/index.css'

const app = createApp(App)
window.app = app
window.$ls = new Ls(window.project.nameSpace);
app.config.globalProperties.$ls = window.$ls
app.use(router)
app.use(XXWebBox)
app.use(store)
filter(router,window.project,{} as FilterCallbacks)
app .mount('#app')
