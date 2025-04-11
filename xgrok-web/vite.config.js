const fs = require("fs")
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import {compression} from "vite-plugin-compression2";
import vueJsx from "@vitejs/plugin-vue-jsx"
const project = require("./src/project")
import copyPlugin from 'vite-copy-plugin'
const path = require('path')


export default defineConfig(({ command, mode })=>{
  let base = command==="build"?"/mobile" :"/"
  fs.writeFileSync("./project.js","window.project="+JSON.stringify(project(mode),null,2),{"flag":"w"})
  return {
    base,
    plugins: [
      vue(),
      compression(),
      vueJsx(),
      copyPlugin([
        {from: 'project.js', to: ''}
      ])
    ],
    define: { 'process.env': {} },
    server:{
      host:'0.0.0.0'
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
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
