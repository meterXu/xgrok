<script setup>
import {defineProps} from 'vue'
import {useAppStore} from "@/store";

const store = useAppStore()
const {systemInfo} = useAppStore()

</script>

<template>
<div class="systemInfo w-full h-full p-16 rounded-4xl bg-(--primary-bg-0) flex flex-col justify-between">
  <div class="text-[14px] font-bold">{{systemInfo?.hostname}}</div>
  <el-tooltip effect="dark" :content="systemInfo?.osVersion">
    <div class="overflow-hidden whitespace-nowrap text-ellipsis">{{systemInfo?.osVersion}}</div>
  </el-tooltip>
</div>
</template>
<style lang="less" scoped>
.systemInfo{
  background: linear-gradient(to right top, var(--release-bg-0), var(--release-bg-1));
}
</style>
