<script setup>
import HeaderToolBar from "@/components/HeaderToolBar.vue";
import {deviceType} from "@/libs/common";
import bus from "@/libs/bus";
let timer=null;
const BaseFontSize = 1000/14; //设计稿尺寸/根字体大小
window.onresize = windowResize;
windowResize();
function windowResize() {
  timer&&clearTimeout(timer);
  timer = setTimeout(() => {
    let width = document.body.clientWidth;
    width=width<800?800:width
    width=width>1000?1000:width
    const widthNum = width / BaseFontSize;
    document.documentElement.style.fontSize = widthNum + 'px';
    bus.$emit('processWidth',widthNum/14)
  }, 100);
}
</script>

<template>
  <el-config-provider>
    <div class="main">
      <HeaderToolBar v-if="deviceType()==='win32'"></HeaderToolBar>
      <div class="main-container">
        <router-view v-slot="{ Component }">
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </router-view>
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
