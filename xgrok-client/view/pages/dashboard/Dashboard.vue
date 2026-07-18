<script setup>
import {
  detailServerConfig,
  queryServersConfig,
  closeWebSocket, getSystemInfo, createClient, updateClient, queryByHostNameOrDeviceId, getXgrokAppCfg
} from '@/api'
import {onMounted} from 'vue'
import {useAppStore} from '@/store';
import ServerConfigs from '@/pages/dashboard/modules/ServerConfig/ServerConfigs.vue'
import SystemCard from "@/pages/dashboard/modules/SystemCard.vue"
import HorizontalHeader from "@/components/header/HorizontalHeader.vue";
import PlusScrollbar from "@/components/plus-scrollbar/PlusScrollbar.vue";
import ServerList from "@/pages/dashboard/modules/ServerConfig/ServerList.vue";
import ServiceSwitch from '@/components/control-btns/ServiceSwitch.vue'
import {useClientTypeExecute, useGetTunnelStatistics} from "@/libs/useAction";
import {payPlan} from "@/libs/enums";
import {storeToRefs} from 'pinia'

const store = useAppStore()
const serviceSwitchRef = ref()
const {selectedServer, clientId, tunnelCount, appSetting, pid,plan} = storeToRefs(store)
const {setSelectedServer,setPid,setPercentage,setClientId,setSystemInfo} = store

useClientTypeExecute(()=>{},()=>{
  window.electronAPI.onAppQuit(() => {
    closeWebSocket()
    setPid(null)
  })
  window.electronAPI.onProcess((_percentage) => {
    setPercentage(_percentage)
  })
  window.electronAPI.onRefreshPid((_pid) => {
    setPid(_pid)
  })
})

async function initServerConfigData() {
  await useClientTypeExecute(async ()=>{
    //webclient模式直接获取后端的selectedServer
    const res = await getXgrokAppCfg()
    if(res.success&&res.data.selected_server_id){
      const res2 = await detailServerConfig(res.data.selected_server_id)
      if(res2.success){
        if(plan.value.value === payPlan.free&&res2.data.is_vip === payPlan.vip){
          setSelectedServer({id:null})
        }else{
          setSelectedServer(res2.data)
        }
      }
    }
    return Promise.resolve()
  },async ()=>{
    //客户端类型为frp模式的则获取selectedServer详情
    if(selectedServer.value.type === window.project.variable.type){
      const res3 = await detailServerConfig(selectedServer.value.id)
      if (res3.success) {
        if(plan.value.value === payPlan.free&&res3.data.is_vip === payPlan.vip){
          setSelectedServer({id:null})
        } else{
          setSelectedServer(res3.data)
        }
      }
    }
    return Promise.resolve()
  })
  // 没有selectedServer，则取第一个
  if (!selectedServer.value.id) {
    queryServersConfig(window.project.variable.type).then(res => {
      setSelectedServer(res.data.records[0])
    })
  }else{
    // webclient模式下如果配置中不存在selected_server_id，需要首次初始化selectedServer
    useClientTypeExecute(()=>{
      !appSetting.value.selected_server_id&&setSelectedServer(selectedServer.value)
    })
  }
}

function initClient() {
  getSystemInfo().then(res => {
    if (res.success) {
      queryByHostNameOrDeviceId(res.data.hostname,res.data.device_id).then(res1 => {
        if (res1.data) {
          setClientId(res1.data.id)
          !res1.data.device_id&&updateClient({
            id: res1.data.id,
            device_id: res.data.device_id
          })
        } else {
          createClient({
            device_id: res.data.device_id,
            hostname: res.data.hostname,
            osVersion: res.data.osVersion
          }).then(res2 => {
            res2.success && setClientId(res2.data)
          })
        }
        const hostname = res1.data?res1.data.hostname:res.data.hostname
        const osVersion = res1.data?res1.data.osVersion:res.data.osVersion
        const device_id = res1.data?res1.data.device_id:res.data.device_id
        setSystemInfo({
          hostname,
          osVersion,
          device_id
        })
      })
    }
  })
}

watchEffect(() => {
  if (selectedServer.value?.id && clientId.value) {
    useGetTunnelStatistics().then(() => {
      if (!pid.value && appSetting.value.autoLaunch && appSetting.value.autoServer) {
        serviceSwitchRef.value.onTurnOn()
      }
    })
  }
})

onMounted(() => {
  initServerConfigData()
  initClient()
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
        <SystemCard class="absolute" :tunnelCount="tunnelCount"></SystemCard>
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
