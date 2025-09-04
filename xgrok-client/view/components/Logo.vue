<script setup>
import {defineProps} from 'vue'
const props = defineProps({
  title:{
    default:''
  },
  size:{
    default:'normal'
  }
})
</script>

<template>
  <div class="flex flex-row items-center gap-4">
    <img src="../../../public/assets/icon.png" alt="logo" :class="size"/>
    <span class="font-bold text-[20px]">{{title}}</span>
  </div>
</template>

<style scoped lang="less">
.normal{
  width:64px
}
.large{
  width:128px
}
</style>
