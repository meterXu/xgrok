<script setup>
import {defineProps,defineEmits} from 'vue'
const props = defineProps({
  title:{
    default:''
  },
  size:{
    default:'64px'
  },
  direction:{
    default:'horizontal'
  }
})
const emits = defineEmits(['chick'])

function onClick(){
  emits('chick')
}
</script>

<template>
  <div class="flex items-center gap-4"
       :class="direction==='horizontal'?'flex-row':'flex-col'"
       :style="{'--size':size}" @click="onClick">
    <img class="logo" src="../../public/assets/icon.png" alt="logo"/>
    <span class="font-bold text-[20px]">{{title}}</span>
  </div>
</template>

<style scoped lang="less">
.logo{
  width: var(--size);
}
</style>
