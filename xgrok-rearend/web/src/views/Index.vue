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
const _project = expandFullProject(window.project)
</script>

<template>
  <XXWebBox :appConfig="_project" :permission="permission"></XXWebBox>
</template>

<style scoped lang="less">

</style>