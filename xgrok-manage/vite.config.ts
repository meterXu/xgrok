import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { fileURLToPath, URL } from 'node:url'
import project from "./src/project.js"
import copyPlugin from 'vite-copy-plugin'
import fs from "fs";
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({mode})=>{
  let _project = project(mode);
  fs.writeFileSync("./project.js","window.project="+JSON.stringify(_project,null,2),{"flag":"w"})
  return {
    base:_project.variable.base,
    plugins: [
      tailwindcss(),
      vue(),
      vueJsx(),
      copyPlugin([
        {from:'project.js',to:''}
      ]),
    ],
    server:{
      port:3000
    },
    optimizeDeps: {
      include: [
        'mermaid'
      ]
    },
    resolve:{
      alias:{
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  }
})