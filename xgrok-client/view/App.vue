<script setup>
import HeaderToolBar from "@/components/HeaderToolBar.vue";
import {deviceType} from "@/libs/common";
</script>

<template>
  <el-config-provider :autoInsertSpace="true">
    <div class="main">
      <HeaderToolBar v-if="deviceType()==='win32'"></HeaderToolBar>
      <div class="main-container">
        <router-view/>
      </div>
    </div>
  </el-config-provider>
</template>

<style lang="less" scoped>
.main{
  display: flex;
  justify-content: flex-start;
  flex-flow: column;
  width: 100vw;
  height: 100vh;
}
.main-container{
  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
