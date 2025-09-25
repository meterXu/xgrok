<script setup>
import {
  detailServerConfig,
  queryServersConfig,
  closeWebSocket
} from '@/api'
import {onMounted, onUnmounted, ref, watch} from 'vue'
import {useAppStore} from '@/store';
import ServerConfigs from '@/pages/dashboard/modules/ServerConfig/ServerConfigs.vue'
import SystemInfo from "@/components/SystemInfo.vue"
import {sendMessage} from '@/worker/mainThread'
import ServerProgress from "@/components/ServerProgress.vue";
import ServiceSwitch from "@/components/control-btns/ServiceSwitch.vue";
import ConfigRefreshBtn from "@/components/control-btns/ConfigRefreshBtn.vue";
import {sleep} from "xxweb-util";
import HorizontalHeader from "@/components/header/HorizontalHeader.vue";
import LeftMiddle from "@/components/left-aside/LeftMiddle.vue";
import {ElementPlus} from "@element-plus/icons-vue";
import PlusScrollbar from "@/components/plus-scrollbar/PlusScrollbar.vue";

const store = useAppStore()
const tunnelWebConfigs = ref(null)
const tunnelServiceConfigs = ref(null)
const serviceSwitch = shallowRef()
const serverLoading = shallowRef(false)
const {selectedServer, percentage} = store

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

async function initServerConfigData() {
  if (selectedServer.value && selectedServer.value.type === window.project.variable.type) {
    let res = await detailServerConfig(selectedServer.value.id)
    if (res.success) {
      store.setSelectedServer(res.data)
    }
  } else {
    let res = await queryServersConfig(window.project.variable.type)
    if (res.success && res.data.records.length > 0) {
      store.setSelectedServer(res.data.records[0])
    }
  }
}

function onChangeServerConfig(_serverConfig) {
  _serverConfig.statusClass = 'server-status-checking'
  store.setSelectedServer(_serverConfig)
}

async function onRefresh() {
  let _refresh = async () => {
    await serviceSwitch.value.onSwitchChange(false)
    await sleep(500)
    await serviceSwitch.value.onSwitchChange(true)
  }
  await _refresh.debounce()()
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
onMounted(async () => {
  await initServerConfigData()
})
onUnmounted(() => {
  sendMessage({type: 'closeCheckServer', server_id: selectedServer?.value?.id})
})
</script>
<template>
  <div class="flex-1 h-full flex flex-col">
    <HorizontalHeader ></HorizontalHeader>
    <div class="flex flex-row gap-32 mt-16 rounded-3xl py-16 px-24 items-center justify-center" v-if="selectedServer">
      <div class="w-300 relative">
        <ServerConfigs class="absolute" @changeServerConfig="onChangeServerConfig"></ServerConfigs>
      </div>
      <div class="flex-1 h-full relative">
        <SystemInfo class="absolute"></SystemInfo>
      </div>
      <div class="w-200">
        <ServerProgress :percentage="percentage"></ServerProgress>
<!--        <ConfigRefreshBtn :loading="serverLoading" @refresh="onRefresh"/>-->
<!--        <ServiceSwitch ref="serviceSwitch"-->
<!--                       :tunnel-service-configs="tunnelServiceConfigs"-->
<!--                       :tunnel-web-configs="tunnelWebConfigs"-->
<!--                       :percentage="percentage"-->
<!--                       @serverLoading="(val)=>{serverLoading=val}"-->
<!--        >-->
<!--        </ServiceSwitch>-->
      </div>
    </div>
    <div class="flex-1 relative mx-24 mt-16 mb-32">
      <div class="absolute w-full h-full bg-(--primary-bg-0) rounded-3xl">
        <div class="w-full h-full relative flex">
         <plus-scrollbar class="relative-scrollbar">
           <div class="absolute left-14 top-14 right-14 bottom-14">
             <div class="server-list">
               <div class="rounded-4xl" v-for="item in Array.from({length:4})" :key="item">{{item}}</div>
             </div>
           </div>
         </plus-scrollbar>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="less">
.server-list{
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 32px;
  div{
    background: var(--server-status-bg);
    width: 100%;
    padding-bottom: 56.2%;
  }
}
</style>
<style lang="less">
.relative-scrollbar{
  .el-scrollbar__view{
    position: relative;
  }
}
</style>
