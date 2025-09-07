<script setup>
import EpPlus from '~icons/ep/plus';
const emits = defineEmits(['add']);
const props=defineProps({
  isEmpty:{
    type:Boolean,
    default:true
  }
})

function onAdd(){
  emits('add')
}
</script>

<template>
<div class="w-full h-full bg-(--tunnel-form-bg)">
  <div v-if="isEmpty" class="w-full h-full flex flex-col items-center justify-center gap-24">
    <img src="@/assets/imgs/no_web_tunnel.png" alt="没有隧道"/>
    <el-button :icon="EpPlus" type="primary" @click="onAdd">添加隧道</el-button>
    <span>
      从<span class="text-(--el-color-primary)">左侧列表</span>选择一个隧道进行操作。
    </span>
    <span>
      如果没有隧道，请点击<span class="text-(--el-color-primary)">添加按钮</span>添加一个试试吧！
    </span>
  </div>
  <slot v-else/>
</div>
</template>

<style scoped lang="less">

</style>
