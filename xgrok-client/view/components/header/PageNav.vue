<script setup>
import {useRoute} from 'vue-router'
import ConfigLockBtn from "@/components/control-btns/ConfigLockBtn.vue";

const route = useRoute();
const props = defineProps({
  hasLock:{
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div class="flex justify-start items-center gap-4">
    <span class="font-bold text-[18px]">{{route.meta?.title}}</span>
    <ConfigLockBtn v-if="hasLock"></ConfigLockBtn>
  </div>
</template>

<style scoped lang="less">

</style>
