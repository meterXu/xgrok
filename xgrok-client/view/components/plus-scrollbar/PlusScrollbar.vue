<script setup>
const scrollbar = ref()
defineExpose({
  scrollbar
})
</script>
<template>
  <div class="relative w-full h-full">
    <el-scrollbar ref="scrollbar" class="h-full w-full absolute!" wrapClass="smooth">
      <slot></slot>
    </el-scrollbar>
  </div>
</template>
<style>
.smooth{
  scroll-behavior: smooth;
}
</style>