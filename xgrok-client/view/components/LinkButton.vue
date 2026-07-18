<script setup>
import {useClientTypeExecute} from "@/libs/useAction";

const props = defineProps(['href','hasArrow'])
const emit = defineEmits(['click'])
function onClick(){
  if(props.href){
    useClientTypeExecute(()=>{
      window.open(props.href,'_blank')
    },()=>{
      window.electronAPI.openExternal(props.href)
    })
  }
  emit('click')
}
</script>

<template>
<div class="rounded-4xl flex items-center justify-center bg-(--link-bg) px-20 py-10 gap-10 cursor-pointer" @click="onClick">
  <span class="text-[24px] leading-[24px] text-(--link-icon)">
    <slot name="icon"></slot>
  </span>
  <span class="text-(--el-color-primary) font-bold inline-flex gap-1 items-end">
    <slot/>
    <IconParkOutlineArrowRightUp v-if="hasArrow" class="text-(--el-color-primary)"/>
  </span>
</div>
</template>

<style scoped lang="less">

</style>
