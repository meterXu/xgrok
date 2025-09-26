<script setup>
import {isOnline} from "@/libs/enums";
import {Check, Loading} from "@element-plus/icons-vue";
import {ElMessage} from "element-plus";
import {useAppStore} from '@/store'
import {watch} from 'vue'
import {checkPermission, checkTunnelConfig} from "@/libs/useAction";
const emits = defineEmits(['serverLoading'])
const store = useAppStore()
const {pid, selectedServer} = store
const props = defineProps(['tunnelWebConfigs','tunnelServiceConfigs','percentage'])
const switchLoading = ref(false)
const status = ref('')
watch(()=>props.percentage,(nv)=>{
  switchLoading.value = nv !== 100;
  emits('serviceLoading',switchLoading.value )
})

const serverAvailability=computed(()=>{
  return selectedServer?.is_online===isOnline.online
})
async function onSwitchChange(value) {
  const exec =async ()=>{
    if (value) {
      if (selectedServer?.value.is_online === isOnline.online)
        await onTurnOn()
      } else {
        await onTurnOff()
      }
  }
  return exec.debounce()()

}
async function onTurnOn() {
  if (checkTunnelConfig(selectedServer?.value,props.tunnelWebConfigs,props.tunnelServiceConfigs)){
    switchLoading.value = true
    emits('serviceLoading',switchLoading.value)
    store.setIsDeleteAll(false)
    store.setDeleteIdsAll([])
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
  }
}
async function onTurnOff() {
  switchLoading.value = true
  emits('serviceLoading',switchLoading.value)
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
<!--  <el-tooltip class="box-item" :popper-options="{modifiers:[{name:'offset',options:{offset:[100, 0]}}]}"-->
<!--              :disabled="selectedServer?.is_online===isOnline.online" effect="light" content="服务不可用"-->
<!--              placement="bottom">-->
<!--    <el-switch size="default" :model-value="Boolean(pid)"-->
<!--               :disabled="selectedServer?.is_online===isOnline.offline"-->
<!--               :style="['&#45;&#45;el-switch-on-color: var(&#45;&#45;el-color-success)',selectedServer?.is_online===isOnline.offline&&'&#45;&#45;el-switch-off-color: var(&#45;&#45;el-color-danger)']"-->
<!--               @change="onSwitchChange">-->
<!--      <template #active-action>-->
<!--        <el-icon v-if="switchLoading" :class="{'is-loading':switchLoading }"><Loading/></el-icon>-->
<!--        <el-icon v-else><Check/></el-icon>-->
<!--      </template>-->
<!--    </el-switch>-->
<!--  </el-tooltip>-->

  <div class="service-switch rounded-4xl w-160 h-full p-14" :class="`power-${status}`">
    <div class="w-full h-full relative">
      <el-tooltip :disabled="!serverAvailability" effect="dark" content="服务不可用">
        <div class="switch absolute rounded-2xl bg-(--power-switch-bg) cursor-pointer flex flex-col items-center justify-center font-bold" @click="onSwitchChange">
          <div class="w-20 h-3 line"></div>
          <span class="mt-12">XGROK POWER</span>
          <EpLoading v-if="switchLoading" class="rotate text-[24px]"/>
          <MdiPowerStandby v-else class="text-[24px]"/>
        </div>
      </el-tooltip>
    </div>
  </div>
</template>

<style scoped lang="less">
.service-switch{
  background: linear-gradient(to right top, var(--release-bg-0), var(--release-bg-1));
  .switch{
    color:var(--server-status-bg);
    left:2px;
    right:2px;
    top:2px;
    bottom: 2px;
    transform:perspective(100rem) rotateX(8deg) translateY(3px);
    box-shadow: 0 0 12px var(--power-switch-shadow);
    .line{
      background: var(--server-status-bg);
      transition: background ease-out .5s;
    }
    transition: background ease-out .5s,color ease-out .5s;
  }
  &.power-success{
    .switch{
      .line{
        background: var(--el-color-success);
      }
      box-shadow: 0 0 12px var(--power-switch-shadow-success);
      color:var(--el-color-success);
      transform:perspective(100rem) rotateX(-8deg) translateY(3px);
    }
  }
  &.power-warning{
    .switch{
      .line{
        background: var(--el-color-warning);
      }
      box-shadow: 0 0 12px var(--power-switch-shadow-warning);
      color:var(--el-color-warning);
      transform:perspective(100rem) rotateX(-8deg) translateY(3px);
    }
  }
  .rotate{
    animation: rotate 2s linear infinite;
  }
  @keyframes rotate {
    from {
      transform: rotate(0deg); /* 起始状态 */
    }
    to {
      transform: rotate(360deg); /* 结束状态 */
    }
  }
}
</style>
