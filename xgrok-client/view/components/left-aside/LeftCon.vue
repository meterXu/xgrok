<script setup lang="ts">
import Menu from "./Menu.vue";
import Logo from "../Logo.vue";

const router = useRouter();
function onChick(){
  router.push({name:'Main'});
}
</script>

<template>
  <el-aside class="w-80! h-full! flex flex-col items-center justify-start gap-8 aside">
    <Logo class="w-48 h-60 mt-24" @chick="onChick"/>
    <Menu class="mt-24!"></Menu>
  </el-aside>
</template>

<style scoped lang="less">
.aside{
  background: linear-gradient(to right bottom, var(--aside-bg), var(--aside-bg2));
}
</style>
