<script setup>
import {useAppStore} from "@/store";
const {systemInfo} = useAppStore()
const {tunnelCount} = defineProps(['tunnelCount'])
</script>

<template>
<div class="systemInfo w-full h-full p-16 rounded-4xl bg-(--primary-bg-0) flex flex-col justify-between">
  <div class="text-[14px] font-bold">{{systemInfo?.hostname}}</div>
  <div class="text-[12px] inline-flex gap-12">
    <span class="inline-block">网页：<span class="font-bold text-(--el-color-primary)">{{tunnelCount.web.length}}/{{tunnelCount.allWeb.length}}</span></span>
    <span class="inline-block">服务：<span class="font-bold text-(--el-color-primary)">{{tunnelCount.service.length}}/{{tunnelCount.allService.length}}</span></span>
  </div>
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
