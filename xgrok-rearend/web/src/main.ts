import { createApp } from 'vue'
import App from './App.vue'
import XXWebBox from 'xxweb-box'
import filter from 'xxweb-util/lib/filter.js'
import {Ls} from 'xxweb-util/lib/util.js'
import router from './router';
import store from "@/store";
import ElementPlus  from 'element-plus';
import 'element-plus/dist/index.css'
import '@/assets/css/index.css'
const app = createApp(App)
window.app = app
app.config.globalProperties.$ls = new Ls(window.project.nameSpace)
app.use(router)
app.use(XXWebBox)
app.use(store)
filter(router,window.project,{})
app.use(ElementPlus,{size:"small"})
app .mount('#app')
