<script setup>
import EpPlus from '~icons/ep/plus';
import bus from '@/libs/bus'

const props = defineProps(['btnText'])

function onAdd(){
  bus.$emit('tunnel:add')
}
</script>

<template>
  <div class="w-full h-full flex flex-col items-center justify-center gap-24">
    <div class="w-400 opacity-70 pointer-events-none select-none" >
      <slot name="picture"></slot>
    </div>
    <el-button :icon="EpPlus" type="primary" @click="onAdd">{{btnText}}</el-button>
    <span>
      从<span class="text-(--el-color-primary)">左侧列表</span>选择一个隧道进行操作。
    </span>
    <span>
      如果没有隧道，请点击<span class="text-(--el-color-primary)">添加按钮</span>添加一个试试吧！
    </span>
  </div>
</template>

<style scoped lang="less">

</style>
