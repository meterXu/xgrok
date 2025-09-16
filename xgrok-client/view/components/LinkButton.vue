<script setup>
const props = defineProps(['href'])
const emit = defineEmits(['click'])
function onClick(){
  if(props.href){
    if(window.project.variable.mode==='browser'){
      window.open(props.href,'_blank')
    }else{
      window.electronAPI.openExternal(props.href)
    }
  }
  emit('click')
}
</script>

<template>
<div class="rounded-4xl flex items-center justify-center bg-(--link-bg) px-20 py-10 gap-10 cursor-pointer" @click="onClick">
  <span class="text-[24px] text-(--link-icon)">
    <slot name="icon"></slot>
  </span>
  <span class="text-(--el-color-primary) font-bold inline-flex gap-1 items-end">
    <slot/>
    <IconParkOutlineArrowRightUp class="text-(--el-color-primary)"/>
  </span>
</div>
</template>

<style scoped lang="less">

</style>
