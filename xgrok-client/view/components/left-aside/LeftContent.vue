<script setup lang="ts">
import Menu from "./Menu.vue";
import Logo from "./Logo.vue";
</script>

<template>
  <div class="h-full w-full bg-(--server-info-bg) p-4 flex flex-col gap-4 border-r-1 border-(--el-border-color)">
    <Logo></Logo>
    <Menu></Menu>
  </div>
</template>

<style scoped lang="less">

</style>
