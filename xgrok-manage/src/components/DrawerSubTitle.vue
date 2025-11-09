<script setup lang="ts">
import {Loading, Refresh} from "@element-plus/icons-vue";
const emits = defineEmits(["click"]);
const props = defineProps(['loading'])
</script>

<template>
  <h3 class="text-[14px] flex flex-row items-center gap-4">
    <span><slot/></span>
    <el-icon class="cursor-pointer hover:text-(--el-color-primary)!"
             @click="()=>{loading?void(0):emits('click')}">
      <Loading v-if="loading" class="is-loading"/>
      <Refresh v-else/>
    </el-icon>
  </h3>
</template>

<style scoped lang="less">

</style>
