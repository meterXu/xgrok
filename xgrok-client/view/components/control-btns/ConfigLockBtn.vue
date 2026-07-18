<script setup>
import IconParkOutlineLock from '~icons/icon-park-outline/lock';
import IconParkOutlineUnlock from '~icons/icon-park-outline/unlock';
import {tipText} from "@/libs/infoText";
import {useAppStore} from "@/store";
import {storeToRefs} from 'pinia'

const store = useAppStore()
const {configIsLock} = storeToRefs(store)
const lockIcon = computed(()=>{
  return configIsLock.value?IconParkOutlineLock:IconParkOutlineUnlock
})
const tooltipText = computed(()=>{
  return tipText.zh.configLockText[Number(configIsLock.value)]
})
function onChangeLock(){
  store.setConfigIsLock(!configIsLock.value)
}
</script>

<template>
  <el-tooltip effect="dark" :content="tooltipText" placement="bottom">
    <el-icon @click="onChangeLock" class="cursor-pointer text-[17px]! hover:text-(--el-color-primary)!">
      <lockIcon/>
    </el-icon>
  </el-tooltip>
</template>

<style scoped lang="less">

</style>
