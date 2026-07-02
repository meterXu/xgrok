<script setup>
import LeftMiddle from "@/components/left-aside/LeftMiddle.vue";
import PageNav from "@/components/header/PageNav.vue";
</script>

<template>
  <div class="h-full flex flex-row justify-start items-start overflow-x-hidden">
    <LeftMiddle>
      <div class="h-60 flex items-center justify-between px-20">
        <PageNav></PageNav>
        <div class="flex flex-row items-center gap-16"></div>
      </div>
      <div class="flex-1 relative"></div>
    </LeftMiddle>
    <div class="flex-1 h-full flex flex-col"></div>
  </div>
</template>

<style scoped lang="less">

</style>
