<script setup>
import {onMounted, ref,onBeforeUnmount} from "vue";
import bus from "@/libs/bus";

const props = defineProps(['percentage'])
const progressWidth = ref(85)
const colors = [
  { color: '#f56c6c', percentage: 20 },
  { color: '#e6a23c', percentage: 40 },
  { color: '#6f7ad3', percentage: 60 },
  { color: '#1989fa', percentage: 80 },
  { color: '#30a44b', percentage: 100 },
]
onMounted(()=>{
  bus.$on('processWidth',(ratio)=>{
    progressWidth.value = 85*ratio.toFixed(2)
  })
})
onBeforeUnmount(()=>{
  bus.$off('processWidth')
})
</script>

<template>
  <el-progress :width="progressWidth" :stroke-width="8" type="dashboard" :percentage="props.percentage" :color="colors">
    <template #default="{ percentage }">
      <span class="text-[16px] font-bold">{{ percentage }}%</span>
    </template>
  </el-progress>
</template>

<style scoped lang="less">

</style>