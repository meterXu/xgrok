<script setup>
import {isOnline} from "@/libs/enums";
import {Check, Close, Loading} from "@element-plus/icons-vue";
import {ElMessage} from "element-plus";
import {useAppStore} from '@/store'
import {watch} from 'vue'
const emits = defineEmits(['serverLoading'])
const store = useAppStore()
const {pid, selectedServer} = store
const props = defineProps(['tunnelWebConfigs','tunnelServiceConfigs','percentage'])
const switchLoading = ref(false)
watch(()=>props.percentage,(nv)=>{
  switchLoading.value = nv !== 100;
  emits('serverLoading',switchLoading.value )
})
async function onSwitchChange(value) {
  switchLoading.value = true
  emits('serverLoading',switchLoading.value)
  if (value) {
    if (selectedServer?.value.is_online === isOnline.online)
      await onTurnOn()
  } else {
    await onTurnOff()
  }
}
async function onTurnOn() {
  store.setIsDeleteAll(false)
  store.setDeleteIdsAll([])
  if (selectedServer?.value && (props.tunnelWebConfigs?.length > 0 || props.tunnelServiceConfigs?.length > 0)) {
    store.setConfigIsLock(true)
    let data = {
      server: selectedServer.value,
      tunnelWebs: props.tunnelWebConfigs,
      tunnelServices: props.tunnelServiceConfigs
    }
    if(window.project.variable.mode==='browser'){
      store.setPid(1)
    }else {
      let res = await window.electronAPI.turnOn(JSON.parse(JSON.stringify(data)))
      if (res.success) {
        store.setPid(res.data.pid)
      } else {
        alert('打开失败，' + res.message)
        store.setConfigIsLock(false)
      }
    }
  } else {
    ElMessage.warning('没有任何配置，请先添加')
  }
}
async function onTurnOff() {
  store.setIsDeleteAll(false)
  store.setDeleteIdsAll([])
  if(window.project.variable.mode==='browser'){
    store.setPid(null)
    store.setConfigIsLock(false)
  }else{
    let res = await window.electronAPI.turnOff(pid.value)
    if (res.success) {
      store.setPid(null)
      store.setConfigIsLock(false)
    } else {
      alert('关闭失败')
    }
  }
}
defineExpose({
  onSwitchChange
})
</script>

<template>
  <el-tooltip class="box-item" :popper-options="{modifiers:[{name:'offset',options:{offset:[100, 0]}}]}"
              :disabled="selectedServer?.is_online===isOnline.online" effect="light" content="服务不可用"
              placement="bottom">
    <el-switch size="default" :model-value="Boolean(pid)"
               :disabled="selectedServer?.is_online===isOnline.offline"
               :style="['--el-switch-on-color: var(--el-color-success)',selectedServer?.is_online===isOnline.offline&&'--el-switch-off-color: var(--el-color-danger)']"
               @change="onSwitchChange">
      <template #active-action>
        <el-icon v-if="switchLoading" :class="{'is-loading':switchLoading }"><Loading/></el-icon>
        <el-icon v-else><Check/></el-icon>
      </template>
    </el-switch>
  </el-tooltip>
</template>

<style scoped lang="less">

</style>