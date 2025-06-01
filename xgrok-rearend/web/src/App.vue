<script setup lang="ts">
import {shallowReactive} from "vue";
import {expandFullProject} from 'xxweb-util/lib/util.js'
const permission = shallowReactive([
  {
    path:'/',
    meta:{
      title:'首页'
    }
  }
])
const _project = expandFullProject({
  nameSpace: "xgrok-rearend-manage",
  redirect: {
    index: '/',
    login: '/login',
    "404": '/404'
  },
  style: {
    theme: 'vue-admin',
    layout: 'sideMenu',
    multiPage: true,
    fixSideMenu: false,
  },
  config:{
    logo: './vite.svg',
    sideMenu:{
      title:'xgrok后台管理',
      width: '300px',
    }
  }
})
</script>

<template>
  <XXWebBox :appConfig="_project" :permission="permission"></XXWebBox>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
