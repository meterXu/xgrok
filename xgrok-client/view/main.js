import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import {filter,Ls,GlobalOverride} from 'xxweb-util'
import 'element-plus/dist/index.css'
import '@/assets/css/main.less'
import pinia from '@/store/index.js'
import directives from "@/libs/directives";

const app = createApp(App)
window.app = app
app.config.productionTip = false
app.config.globalProperties.$project = window.project
app.config.globalProperties.$ls = new Ls(window.project.nameSpace)
app.use(pinia)
app.use(router)
app.directive('debounce', directives.debounce)
filter(router, window.project,{permission:false})
GlobalOverride(['debounce'])
app.mount('#app')

function makeDraggable(element) {
    element = document.querySelector(element);
    let dragging = false;
    let mouseX = 0;
    let mouseY = 0;
    element.addEventListener('mousedown', (e) => {
        dragging = true;
        const { pageX, pageY } = e;
        mouseX = pageX;
        mouseY = pageY;
    });
    window.addEventListener('mouseup', () => {
        dragging = false;
    });
    window.addEventListener('mousemove', (e) => {
        if (dragging) {
            const { pageX, pageY } = e;
            window.electronAPI.setXY({
                mouseX,
                mouseY,
                pageX,
                pageY
            })
        }
    });
}
