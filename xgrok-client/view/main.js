import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import {filter,util} from 'xxweb-box'
import 'element-plus/dist/index.css'
import '@/assets/main.less'
import pinia from '@/store/index.js'

const app = createApp(App)
window.app = app
app.config.productionTip = false
app.config.globalProperties.$project = window.project
app.config.globalProperties.$ls = new util.ls(window.project)
app.use(pinia)
app.use(router)
filter(router, window.project)
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