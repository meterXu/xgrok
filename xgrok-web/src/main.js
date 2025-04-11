import { createApp } from 'vue'
import App from './App.vue'
import {filter,util} from 'xxweb-box'
import XXWebBox from 'xxweb-box'
import router from './router';
import elementUI from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import '@/assets/main.less'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)
window.app = app
app.config.productionTip = false
app.config.globalProperties.$project = window.project
app.config.globalProperties.$ls = new util.ls(window.project)
app.use(XXWebBox)
app.use(elementUI)
app.use(router)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.mount('#app')

