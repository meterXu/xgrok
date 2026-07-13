<script setup>
import {isOnline, NotificationType, statusType} from "@/libs/enums";
import {useAppStore} from '@/store'
import {checkTunnelConfig, useClientTypeExecute} from "@/libs/useAction";
import {isEmpty,$on,$off} from "xxweb-util";
import {onMounted,onUnmounted} from 'vue';
import {alert, showNotification} from "@/libs/message";
import {queryTunnelCount, serviceTurnOff, serviceTurnOn, serviceTurnRestart} from "@/api";
const emits = defineEmits(['serverLoading'])
const store = useAppStore()
const {pid, selectedServer,tunnelCount,setTunnelCount,clientId} = store
const switchLoading = ref(false)

const serverAvailability=computed(()=>{
  return selectedServer?.is_online===isOnline.online
})

const status = computed(()=>{
  if(isEmpty(pid.value)){
    return ''
  }else{
    return pid.value!==0?'success':'error'
  }
})

async function onSwitchChange() {
  if(!selectedServer.id){
    showNotification(NotificationType.warning,'请选择一个服务再启动')
    return false
  }
  if (!pid.value) {
    await onTurnOn()
  } else {
    await onTurnOff()
  }
}

async function onTurnOn(isRestart = false) {
  if(!selectedServer.id){
    showNotification(NotificationType.warning,'请选择一个服务再启动')
    return false
  }
  let data = {
    pid:pid.value,
    server: selectedServer,
    tunnelWebs: toRaw(tunnelCount.web.filter(c=>c.status)),
    tunnelServices: toRaw(tunnelCount.service.filter(c=>c.status))
  }
  if (checkTunnelConfig(data.server,data.tunnelWebs,data.tunnelServices)){
    switchLoading.value = true
    store.setConfigIsLock(true)
    try{
      let res = await useClientTypeExecute(async ()=>{
         return isRestart?serviceTurnRestart(data):serviceTurnOn(data)
      },async ()=>{
        return isRestart?window.electronAPI.turnRestart(JSON.parse(JSON.stringify(data)))
            :window.electronAPI.turnOn(JSON.parse(JSON.stringify(data)))
      })
      if (res.success) {
        store.setPid(res.data)
        store.setAppSetting({autoServer:true})
        !isRestart&&showNotification(NotificationType.success,'启动成功')
      } else {
        store.setPid(0)
        store.setConfigIsLock(false)
        alert(
            res.message,isRestart?'重启失败':'启动失败',{
              dangerouslyUseHTMLString:true,
              confirmButtonClass:'el-button--danger is-plain'
            })
      }
    }finally {
      switchLoading.value = false
    }
  }else if(isRestart&&pid.value){
    await onTurnOff()
  }
}

async function onTurnOff() {
  switchLoading.value = true
  try{
    let res = await useClientTypeExecute(()=>{
      return serviceTurnOff({pid:pid.value})
    },async ()=>{
      return window.electronAPI.turnOff(pid.value)
    })
    if (res.success) {
      store.setPid(null)
      store.setConfigIsLock(false)
      store.setAppSetting({autoServer:false})
      showNotification(NotificationType.success,'关闭成功')
    } else {
      alert(res.data.message,'关闭失败',{
        dangerouslyUseHTMLString:true,
        confirmButtonClass:'el-button--danger is-plain'
      })
    }
  }finally {
    switchLoading.value = false
  }
}

async function onRestart() {
  let _refresh = async () => {
    await onTurnOn(true)
  }
  await _refresh.debounce()()
}

onMounted(()=>{
  $on('restart',onRestart)
})

onUnmounted(()=>{
  $off('restart')
})

defineExpose({
  onTurnOn,
  onTurnOff,
})
</script>

<template>
  <div class="service-switch-wrap rounded-4xl w-160 h-full p-14">
    <div class="w-full h-full relative">
      <el-tooltip :disabled="serverAvailability" effect="dark" content="服务不可用">
        <div class="switch absolute rounded-2xl bg-(--power-switch-bg) cursor-pointer flex flex-col items-center justify-center font-bold gap-4"
             :class="`power-${status}`"
             v-debounce:click="onSwitchChange">
          <span class="mt-12 text-center">XGROK POWER</span>
          <EpLoading v-if="switchLoading" class="rotate text-[24px]"/>
          <MdiPowerStandby v-else class="text-[24px]"/>
        </div>
      </el-tooltip>
    </div>
  </div>
</template>

<style scoped lang="less">
.service-switch-wrap{
  background: linear-gradient(to right top, var(--release-bg-0), var(--release-bg-1));
  .switch{
    color:var(--server-status-bg);
    left:2px;
    right:2px;
    top:2px;
    bottom: 2px;
    box-shadow: 0 0 6px var(--power-switch-shadow);
    user-select: none;
    .line{
      background: var(--server-status-bg);
      transition: background ease-out .5s;
    }
    transition: background ease-out .5s,color ease-out .5s;
    &:active{
      transform: scale(0.97);
      box-shadow: inset 0 1px 6px var(--power-switch-shadow);
    }
    &.power-success{
      .line{
        background: var(--el-color-success);
      }
      box-shadow: 0 0 12px var(--power-switch-shadow-success);
      color:var(--el-color-success);
    }
    &.power-error{
      .line{
        background: var(--el-color-danger);
      }
      box-shadow: 0 0 12px var(--power-switch-shadow-danger);
      color:var(--el-color-danger);
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
