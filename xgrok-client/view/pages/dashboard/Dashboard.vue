<script setup>
import {
  detailServerConfig,
  queryServersConfig,
  closeWebSocket, queryTunnelCount, getSystemInfo, queryClient, createClient, updateClient
} from '@/api'
import {onMounted, onUnmounted, watch} from 'vue'
import {useAppStore} from '@/store';
import ServerConfigs from '@/pages/dashboard/modules/ServerConfig/ServerConfigs.vue'
import SystemCard from "@/pages/dashboard/modules/SystemCard.vue"
import {sendMessage} from '@/worker/mainThread'
import HorizontalHeader from "@/components/header/HorizontalHeader.vue";
import PlusScrollbar from "@/components/plus-scrollbar/PlusScrollbar.vue";
import ServerList from "@/pages/dashboard/modules/ServerConfig/ServerList.vue";
import ServiceSwitch from '@/components/control-btns/ServiceSwitch.vue'

const store = useAppStore()
const serviceSwitchRef = ref()
const {selectedServer,clientId,systemInfo,tunnelCount,setTunnelCount,appSetting,pid} = store

if (window.project.variable.mode !== 'browser') {
  window.electronAPI.onAppQuit(() => {
    closeWebSocket()
    store.setPid(null)
  })
  window.electronAPI.onProcess((_percentage) => {
    store.setPercentage(_percentage)
  })
  window.electronAPI.onRefreshPid((_pid) => {
    store.setPid(_pid)
  })
}

function initServerConfigData() {
  if (selectedServer.value && selectedServer.value.type === window.project.variable.type) {
    detailServerConfig(selectedServer.value.id).then(res=>{
      if (res.success) {
        store.setSelectedServer(res.data)
      }
    })
  } else {
    queryServersConfig(window.project.variable.type).then(res=>{
      if (res.success && res.data.records.length > 0) {
        store.setSelectedServer(res.data.records[0])
      }
    })
  }
}

function initClient() {
  getSystemInfo().then(res=>{
    if (res.success) {
      store.setSystemInfo(res.data)
      if (!clientId.value) {
        queryClient(res.data.hostname).then(res1=>{
          if (res1.success) {
            if (res1.data.records.length > 0) {
              store.setClientId(res1.data.records[0].id)
            } else {
              createClient({
                hostname: systemInfo.hostname,
                osVersion: systemInfo.osVersion
              }).then(res2=>{
                res2.success && store.setClientId(res2.data)
              })
            }
          }
        })
      } else {
        updateClient({
          id: clientId.value,
          hostname: systemInfo.hostname,
          osVersion: systemInfo.osVersion
        })
      }
    }
  })
}



watch(() => selectedServer?.value?.id, (nv, ov) => {
  sendMessage({type: 'closeCheckServer', server_id: ov})
  sendMessage({
    type: 'openCheckServer',
    baseApi: window.project.variable.baseApi,
    server_id: nv,
    domain: selectedServer?.value?.domain,
    port: selectedServer?.value?.port
  })
}, {immediate: true})

watchEffect(()=>{
  if(selectedServer.value?.id&&clientId.value){
    queryTunnelCount(selectedServer.value?.id,clientId.value).then(res=>{
      tunnelCount.web.splice(0,tunnelCount.web.length,...res.web)
      tunnelCount.service.splice(0,tunnelCount.service.length,...res.service)
      setTunnelCount(tunnelCount)
      if(!pid.value&&appSetting.autoLaunch&&appSetting.autoServer){
        serviceSwitchRef.value.onTurnOn()
      }
    })
  }
})

onMounted( () => {
  initServerConfigData()
  initClient()
})
onUnmounted(() => {
  sendMessage({type: 'closeCheckServer', server_id: selectedServer?.value?.id})
})
</script>
<template>
  <div class="flex-1 h-full flex flex-col">
    <HorizontalHeader></HorizontalHeader>
    <div class="h-150 flex flex-row gap-32 mt-16 rounded-3xl py-16 px-24 items-center justify-center"
         v-if="selectedServer">
      <div class="w-300 h-full relative">
        <ServerConfigs class="absolute" :tunnelCount="tunnelCount"></ServerConfigs>
      </div>
      <div class="flex-1 h-full relative">
        <SystemCard class="absolute"></SystemCard>
      </div>
      <ServiceSwitch ref="serviceSwitchRef">
      </ServiceSwitch>
    </div>
    <div class="flex-1 relative mx-24 mt-16 mb-32">
      <div class="absolute w-full h-full bg-(--primary-bg-0) rounded-3xl">
        <div class="w-full h-full relative flex">
          <plus-scrollbar class="relative-scrollbar">
            <div class="absolute left-16 top-16 right-16 bottom-16">
              <ServerList>
              </ServerList>
            </div>
          </plus-scrollbar>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="less">
.relative-scrollbar {
  .el-scrollbar__view {
    position: relative;
    width: 100%;
    height: 100%;
  }
}
</style>
