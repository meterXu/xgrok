<script setup>
import {useAppStore} from "@/store";

const {systemInfo} = useAppStore()
const {tunnelCount} = defineProps(['tunnelCount'])
</script>

<template>
  <div class="systemInfo w-full h-full p-16 rounded-4xl bg-(--primary-bg-0) flex flex-col justify-between">
    <div class="text-[14px] font-bold flex items-center justify-between gap-8">
      <span class="inline-flex items-center gap-4 text-(--el-color-primary)">
        <MdiComputer/>
            <el-tooltip effect="dark" :content="systemInfo?.hostname">
              <div class="truncate max-w-200">{{ systemInfo?.hostname }}</div>
            </el-tooltip>
      </span>
      <span class="inline-flex items-center gap-4">
        <MdiLocalAreaNetworkConnect/>
        <el-tooltip effect="dark" content="总设备数">
          <span>3</span>
        </el-tooltip>
      </span>
    </div>
    <div>
      <el-tooltip effect="dark" content="当前设备隧道数/所有设备隧道数">
        <div class="text-[12px] inline-flex gap-12">
        <span class="inline-block">
          网页：<span class="font-bold text-(--el-color-primary)">{{ tunnelCount.web.length }}</span>/{{tunnelCount.allWeb.length}}
        </span>
          <span class="inline-block">
          服务：<span class="font-bold text-(--el-color-primary)">{{ tunnelCount.service.length }}</span>/{{tunnelCount.allService.length }}
        </span>
        </div>
      </el-tooltip>
    </div>
    <el-tooltip effect="dark" :content="systemInfo?.osVersion">
      <div class="truncate max-w-280 text-[12px]">{{ systemInfo?.osVersion }}</div>
    </el-tooltip>
  </div>
</template>
<style lang="less" scoped>
.systemInfo {
  background: linear-gradient(to right top, var(--release-bg-0), var(--release-bg-1));
}
</style>
