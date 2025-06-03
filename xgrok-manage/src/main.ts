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
import zhCn from 'element-plus/es/locale/lang/zh-cn'
const app = createApp(App)
window.app = app
window.$ls = new Ls(window.project.nameSpace);
app.config.globalProperties.$ls = window.$ls
app.use(router)
app.use(XXWebBox)
app.use(store)
filter(router,window.project,{})
app.use(ElementPlus,{size:"small",locale: zhCn})
app .mount('#app')
