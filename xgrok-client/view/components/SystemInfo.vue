<script setup>
import {defineProps} from 'vue'
const props=defineProps(['value'])
</script>

<template>
<div class="systemInfo">
  <div class="systemInfo-item systemInfo-item-hostname">{{props.value?.hostname}}</div>
  <div class="systemInfo-item systemInfo-item-version">{{props.value?.osVersion}}</div>
</div>
</template>

<style scoped lang="less">
@import "@/assets/mixin.less";
.systemInfo{
  .pxToVW(200,min-width);
  .pxToVW(320,max-width);
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  background: var(--server-info-bg);
  .systemInfo-item{
    text-align: left;
    font-size: 14px;
    height: 34.5px;
    line-height: 34.5px;
    padding-left: 8px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .systemInfo-item-hostname{
    font-size: 14px;
    font-weight: 600;
    height: 40px;
    line-height: 40px;
  }
}
</style>