<script setup>
import {defineProps} from 'vue'
import {useAppStore} from "@/store";

const store = useAppStore()
const {systemInfo} = useAppStore()

</script>

<template>
<div class="systemInfo">
  <div class="systemInfo-item systemInfo-item-hostname">{{systemInfo?.hostname}}</div>
  <div class="systemInfo-item systemInfo-item-version">{{systemInfo?.osVersion}}</div>
</div>
</template>

<style scoped lang="less">
@import "@/assets/css/mixin.less";
.systemInfo{
  .pxToVW(200,min-width);
  .pxToVW(320,max-width);
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  background: var(--server-info-bg);
  .systemInfo-item{
    text-align: left;
    font-size: 14px;
    padding: 8px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .systemInfo-item-hostname{
    font-size: 14px;
    font-weight: 600;
    padding: 9px 8px;
  }
}
</style>
