<script setup>
import {defineProps,defineEmits} from 'vue'
import {getTheme} from "@/libs/common";

const props = defineProps({
  title:{
    default:''
  },
  size:{
    default:'16rem'
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
    <img v-show="getTheme()==='light'" class="logo" src="../../public/assets/icon_light.png" alt="logo"/>
    <img v-show="getTheme()==='dark'" class="logo" src="../../public/assets/icon_dark.png" alt="logo"/>
    <span class="font-bold text-[20px]">{{title}}</span>
  </div>
</template>

<style scoped lang="less">
.logo{
  width: var(--size);
}
</style>
