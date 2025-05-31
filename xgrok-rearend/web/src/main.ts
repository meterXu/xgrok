import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
// import XXWebBox from 'xxweb-box'
import router from './router';

const app = createApp(App)
app.use(router)
// app.use(XXWebBox)
app .mount('#app')
