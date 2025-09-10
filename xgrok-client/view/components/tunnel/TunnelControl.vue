<script setup>
import IconParkSolidPlayOne from '~icons/icon-park-solid/play-one';

function onTest() {

}
</script>

<template>
  <div class="h-42 flex flex-row items-center p-20 bg-(--primary-bg-0) border-b-1 border-(--border-color)">
    <el-button type="text" :icon="IconParkSolidPlayOne" @click="onTest">测试</el-button>
  </div>
</template>

<style scoped lang="less">

</style>
