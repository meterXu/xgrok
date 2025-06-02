import { createApp } from 'vue'
import App from './App.vue'
import XXWebBox from 'xxweb-box'
import filter from 'xxweb-util/lib/filter.js'
import router from './router';
import ElementPlus  from 'element-plus';
import 'element-plus/dist/index.css'
import '@/assets/css/index.css'
const app = createApp(App)
app.use(router)
app.use(XXWebBox)
filter(router,window.project,{})
app.use(ElementPlus,{size:"small"})
app .mount('#app')
