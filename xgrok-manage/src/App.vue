<script setup lang="ts">
let timer:any=0;
const BaseFontSize = 1920/4; //设计稿尺寸/根字体大小
window.onresize = windowResize;
windowResize();
function windowResize() {
  timer&&clearTimeout(timer);
  timer = setTimeout(() => {
    let width = document.body.clientWidth;
    width=width<1920?1920:width
    const widthNum = width / BaseFontSize;
    document.documentElement.style.fontSize = widthNum + 'px';
  }, 100)
}
</script>

<template>
  <router-view/>
</template>

<style scoped>
</style>
