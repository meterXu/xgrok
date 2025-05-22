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
    <el-icon @click="onChangeLock" class="text-[16px]! text-(--edit-icon-color)! hover:text-(--el-color-primary)!">
      <lockIcon/>
    </el-icon>
  </el-tooltip>
</template>

<style scoped lang="less">

</style>