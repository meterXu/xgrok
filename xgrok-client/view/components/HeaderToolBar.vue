<script setup>
import {Close, FullScreen, Minus,Plus} from "@element-plus/icons-vue";

const appName = window.project.variable.appName
function onMinus(){
  window.electronAPI.minWindow()
}

function onFullScreen(){
  window.electronAPI.maxWindow()
}

function onClose(){
  window.electronAPI.closeWindow()
}
</script>

<template>
  <div class="header-toolbar-wrap">
    <ul class="header-toolbar">
      <li @click="onMinus"><el-icon><Minus /></el-icon></li>
      <li @click="onFullScreen"><el-icon><FullScreen /></el-icon></li>
      <li @click="onClose" class="close-btn"><el-icon><Close /></el-icon></li>
    </ul>
  </div>
</template>

<style scoped lang="less">
.header-toolbar-wrap{
  background-color: var(--header-bg);
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  -webkit-app-region: drag
}
.logo{
  width: 16px;
  height: 16px;
  background: url("../../public/assets/icon.png") no-repeat center center;
  background-size: contain;
  margin-left: 4px;
  padding-left: 24px;
}
.header-toolbar{
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  li{
    width: 48px;
    height: 24px;
    cursor: pointer;
    text-align: center;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    -webkit-app-region: no-drag;
  }
  li:hover{
    background-color: var(--primary-btn-hover-bg);
  }
  .close-btn:hover{
    background-color: var(--el-color-danger);
  }
}
</style>