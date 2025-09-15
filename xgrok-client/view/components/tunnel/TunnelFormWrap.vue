<script setup>
import bus from '@/libs/bus'
const emits = defineEmits(['add']);
onMounted(() => {
  bus.$on('tunnel:add', () => {
    emits('add')
  })
})
</script>

<template>
<div class="w-full h-full">
  <slot/>
</div>
</template>

<style scoped lang="less">

</style>
