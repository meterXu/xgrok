import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import XXWebBox from 'xxweb-box'
import router from './router';
import ElementPlus  from 'element-plus';
import 'element-plus/dist/index.css'
const app = createApp(App)
app.use(router)
app.use(XXWebBox)
app.use(ElementPlus,{size:"small"})
app .mount('#app')
