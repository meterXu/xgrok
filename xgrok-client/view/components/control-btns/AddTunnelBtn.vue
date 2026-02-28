<script setup>
import {useAppStore} from "@/store";
import {defineEmits} from "vue"

const {configIsLock} = useAppStore()
const emits = defineEmits(['addTunnel'])

function onAddTunnel() {
  emits('addTunnel')
}
</script>

<template>
  <el-tooltip content="添加隧道">
    <IconParkOutlineAdd class="text-[16px] hover:text-(--el-color-primary)!"
                        :class="configIsLock?'cursor-not-allowed':'cursor-pointer'"
                        @click="onAddTunnel"/>
  </el-tooltip>
</template>

<style scoped lang="less">

</style>
