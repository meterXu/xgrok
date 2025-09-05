<script setup>
import {useRoute} from 'vue-router'

const route = useRoute();
const props = defineProps({
  hasLock:{
    type: Boolean,
    default: true
  }
})
</script>

<template>
  <div class="flex justify-start items-center gap-4">
    <span class="font-bold text-[18px]">{{route.meta?.title}}</span>
  </div>
</template>

<style scoped lang="less">

</style>
