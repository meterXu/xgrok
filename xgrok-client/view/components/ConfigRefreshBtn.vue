<script setup>
import {Refresh} from "@element-plus/icons-vue";
import {defineEmits} from 'vue'
import {useAppStore} from '@/store'
const emits = defineEmits(['refresh'])
const props = defineProps(['loading'])
const {pid} = useAppStore()
</script>

<template>
  <el-tooltip effect="light" content="刷新服务" placement="bottom">
    <el-icon class="text-[16px]! text-(--edit-icon-color)! hover:text-(--el-color-primary)!">
      <Refresh :disabled="!Boolean(pid)||loading" @click="emits('refresh')"/>
    </el-icon>
  </el-tooltip>
</template>

<style scoped lang="less">
.el-button+.el-button{
  margin-left: 0;
}
</style>