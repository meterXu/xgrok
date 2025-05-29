<script setup>
import {Refresh} from "@element-plus/icons-vue";
import {defineEmits} from 'vue'
import {useAppStore} from '@/store'
const emits = defineEmits(['refresh'])
const props = defineProps(['loading'])
const {pid} = useAppStore()

const disabled = computed(()=>{
  return !Boolean(pid.value)||props.loading
})

function onRefresh(){
  !disabled.value&&emits('refresh')
}
</script>

<template>
  <el-tooltip effect="light" content="刷新服务" placement="bottom">
    <el-icon class="text-[16px]!"
             :class="disabled?'text-(--el-color-disabled)! cursor-not-allowed':'text-(--edit-icon-color)! hover:text-(--el-color-primary)!'">
      <Refresh @click="onRefresh"/>
    </el-icon>
  </el-tooltip>
</template>