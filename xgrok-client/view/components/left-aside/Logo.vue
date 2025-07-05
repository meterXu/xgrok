<script setup>
import {defineProps} from 'vue'
const props = defineProps(['title'])
</script>

<template>
  <div class="flex flex-row items-center gap-4">
    <img src="../../../public/assets/icon.png" alt="logo" class="w-48"/>
    <span class="font-bold text-[20px]">{{props.title}}</span>
  </div>
</template>

<style scoped lang="less">

</style>
