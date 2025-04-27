const fs = require("fs")
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import {compression} from 'vite-plugin-compression2';
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import ElementPlus from 'unplugin-element-plus/vite'
const project = require("./view/project")
import copyPlugin from 'vite-copy-plugin'
const path = require('path')


export default defineConfig(({command,mode})=>{
  let base = command==="build"?"./" :"/"
  const _project = project(mode)
  fs.writeFileSync("./project.js","window.project="+JSON.stringify(_project,null,2),{"flag":"w"})
  return {
    base,
    build: {
      rollupOptions: {
        input: 'index.html'
      }
    },
    plugins: [
      vue(),
      compression(),
      vueJsx(),
      copyPlugin([
        {from:'project.js',to:''}
      ]),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
      ElementPlus({})
    ],
    define: { 'process.env': {} },
    server:{
      host:'0.0.0.0'
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'view'),
      },
    },
    test: {
      global: true, // --> 0.8.1+  请修改成globals
      environment: 'jsdom',
      include: ['**/tests/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
      passWithNoTests: true,
      transformMode: {
        web: [/\.[jt]sx$/]
      }
    }
  }
})
