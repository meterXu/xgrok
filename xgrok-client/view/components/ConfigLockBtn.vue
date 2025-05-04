<script setup>
import {Unlock,Lock} from "@element-plus/icons-vue";
import {tipText} from "@/libs/infoText";
import {useAppStore} from "@/store";

const store = useAppStore()
const {configIsLock} = store
const lockIcon = computed(()=>{
  return configIsLock.value?Lock:Unlock
})
const tooltipText = computed(()=>{
  return tipText.zh.configLockText[Number(configIsLock.value)]
})
function onChangeLock(){
  store.setConfigIsLock(!configIsLock.value)
}
</script>

<template>
  <el-tooltip effect="light" :content="tooltipText" placement="bottom">
    <el-button plain size="small" circle :icon="lockIcon" @click="onChangeLock"></el-button>
  </el-tooltip>
</template>

<style scoped lang="less">

</style>