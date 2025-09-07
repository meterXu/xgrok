import { createApp } from 'vue'
import App from './App.vue'
import XXWebBox from 'xxweb-box'
import {filter, type FilterCallbacks, resizeFontSize} from 'xxweb-util'
import {Ls,GlobalOverride} from 'xxweb-util'
import router from './router';
import store from "@/store";
import '@/assets/css/index.css'
window.onresize = ()=>{
    resizeFontSize(1920,4,0,(width)=>{
        if(width <= 1280){
            return 1280
        }
        else if(width <= 1366){
            return 1366
        }
        else if(width <= 1920){
            return 1920
        }
        return width
    }).then(width=>{
        console.log(width)
    })
}
//@ts-ignore
window.onresize()
const app = createApp(App)
window.app = app
window.$ls = new Ls(window.project.nameSpace);
app.config.globalProperties.$ls = window.$ls
app.use(router)
app.use(XXWebBox)
app.use(store)
filter(router,window.project,{permission:true} as FilterCallbacks)
GlobalOverride(['debounce'])
app .mount('#app')
