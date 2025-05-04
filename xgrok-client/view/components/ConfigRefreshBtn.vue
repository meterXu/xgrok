<script setup>
import {Refresh} from "@element-plus/icons-vue";
import {defineEmits} from 'vue'
import {useAppStore} from '@/store'
const emits = defineEmits(['refresh'])
const {pid} = useAppStore()
</script>

<template>
  <el-tooltip effect="light" content="刷新服务" placement="bottom">
    <el-button :disabled="!Boolean(pid)" plain size="small" circle :icon="Refresh" @click="emits('refresh')"></el-button>
  </el-tooltip>
</template>

<style scoped lang="less">
.el-button+.el-button{
  margin-left: 0;
}
</style>