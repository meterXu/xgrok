<script setup>
import {
  detailServerConfig,
  getSystemInfo,
  queryServersConfig,
  queryTunnelServiceConfig,
  queryTunnelWebConfig,
  queryClient,
  createClient, updateClient, closeWebSocket
} from '@/api'
import {onMounted, onUnmounted, ref, watch,computed} from 'vue'
import {useAppStore} from '@/store';
import ServerConfigs from '@/pages/dashboard/modules/ServerConfig/ServerConfigs.vue'
import ConfigDialog from "@/components/ConfigDialog.vue";
import TunnelWebFrom from "@/pages/dashboard/modules/TunnelWeb/TunnelWebFrom.vue";
import TunnelServiceFrom from "@/pages/dashboard/modules/TunnelService/TunnelServiceFrom.vue";
import TunnelList from "@/pages/dashboard/modules/TunnelList.vue";
import TunnelWebConfigItem from "@/pages/dashboard/modules/TunnelWeb/TunnelWebConfigItem.vue";
import TunnelServiceConfigItem from "@/pages/dashboard/modules/TunnelService/TunnelServiceConfigItem.vue";
import SystemInfo from "@/components/SystemInfo.vue"
import {sendMessage} from '@/worker/mainThread'
import ServerProgress from "@/components/ServerProgress.vue";
import ServerSwitch from "@/components/ServerSwitch.vue";
import ConfigLockBtn from "@/components/ConfigLockBtn.vue";
import ConfigRefreshBtn from "@/components/ConfigRefreshBtn.vue";
import {sleep} from "@/libs/common";
const store = useAppStore()
const serverConfigs = ref(null)
const tunnelWebConfigs = ref(null)
const tunnelServiceConfigs = ref(null)
const tunnelLoading = ref(true)
const systemInfo = ref(null)
const percentage = ref(0)
const serverSwitch = shallowRef()
const serverLoading = shallowRef(false)
const {pid, selectedServer, dialogVisible, clientId} = store

if (window.project.variable.mode !== 'browser') {
  window.electronAPI.onAppQuit(() => {
    closeWebSocket()
    store.setPid(null)
  })
  window.electronAPI.onRefreshPid((pid) => {
    store.setPid(pid)
  })
  window.electronAPI.onProcess((_percentage)=>{
    console.log(_percentage)
    percentage.value = _percentage
  })
}
async function initServerConfigData() {
  if (selectedServer.value) {
    let res = await detailServerConfig(selectedServer.value.id)
    if (res.success) {
      store.setSelectedServer(res.data)
    }
  } else {
    let res = await queryServersConfig()
    if (res.success && res.data.records.length > 0) {
      store.setSelectedServer(res.data.records[0])
    }
  }
}
function loadTunnelData() {
  if (!selectedServer.value) {
    return
  }
  tunnelLoading.value = true
  Promise.all([queryTunnelWebConfig(selectedServer.value.id, clientId.value), queryTunnelServiceConfig(selectedServer.value.id, clientId.value)])
      .then(allRes => {
        if (allRes[0].success) {
          tunnelWebConfigs.value = allRes[0].data
        }
        if (allRes[1].success) {
          tunnelServiceConfigs.value = allRes[1].data
        }
      }).finally(() => {
    tunnelLoading.value = false;
    store.setIsDeleteAll(false)
    store.setDeleteIdsAll([])
  })
}
function onChangeServerConfig(_serverConfig) {
  _serverConfig.statusClass = 'server-status-checking'
  store.setSelectedServer(_serverConfig)
  loadTunnelData()
}
async function initClient() {
  let res = await getSystemInfo()
  if (res.success) {
    systemInfo.value = res.data
    if (!clientId.value) {
      systemInfo.value = res.data
      res = await queryClient(res.data.hostname)
      if (res.success) {
        if (res.data.records.length > 0) {
          store.setClientId(res.data.records[0].id)
        } else {
          res = await createClient({
            hostname: systemInfo.value.hostname,
            osVersion: systemInfo.value.osVersion
          })
          res.success && store.setClientId(res.data)
        }
      }
    } else {
      updateClient({
        id: clientId.value,
        hostname: systemInfo.value.hostname,
        osVersion: systemInfo.value.osVersion
      })
    }
  }
}
async function onRefresh(){
  let _refresh=async ()=>{
    await serverSwitch.value.onSwitchChange(false)
    await sleep(500)
    await serverSwitch.value.onSwitchChange(true)
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
  await initClient()
  loadTunnelData()
})
onUnmounted(() => {
  sendMessage({type: 'closeCheckServer', server_id: selectedServer?.value?.id})
})
</script>
<template>
  <div class="ngrok-config-wrap">
    <el-card class="server-wrap" v-if="selectedServer">
      <div class="info-wrap">
        <div class="server-info">
          <ServerConfigs @changeServerConfig="onChangeServerConfig"></ServerConfigs>
        </div>
        <SystemInfo :value="systemInfo"></SystemInfo>
      </div>
      <div class="flex items-center justify-center">
        <ServerProgress :percentage="percentage"></ServerProgress>
      </div>
    </el-card>
    <el-tabs class="tunnel-config-wrap" type="border-card" editable v-loading="tunnelLoading">
      <template #add-icon>
        <div class="flex flex-row items-center justify-between gap-8">
          <ConfigLockBtn/>
          <ConfigRefreshBtn :loading="serverLoading" @refresh="onRefresh"/>
          <ServerSwitch ref="serverSwitch"
                        :tunnel-service-configs="tunnelServiceConfigs"
                        :tunnel-web-configs="tunnelWebConfigs"
                        :percentage="percentage"
                        @serverLoading="(val)=>{serverLoading=val}"
          >
          </ServerSwitch>
        </div>
      </template>
      <el-tab-pane>
        <template #label>
          <i-icon-park-outline-earth></i-icon-park-outline-earth>
          <span class="ml-4 text-[14px]">网页</span>
        </template>
        <TunnelList type="web" :tunnelConfigs="tunnelWebConfigs" @deleteComplete="loadTunnelData">
          <template #default="{tunnelConfig}">
            <TunnelWebConfigItem :tunnelConfig="tunnelConfig"></TunnelWebConfigItem>
          </template>
        </TunnelList>
      </el-tab-pane>
      <el-tab-pane>
        <template #label>
          <i-icon-park-outline-server></i-icon-park-outline-server>
          <span class="ml-4 text-[14px]">服务</span>
        </template>
        <TunnelList type="service" :tunnelConfigs="tunnelServiceConfigs" @deleteComplete="loadTunnelData">
          <template #default="{tunnelConfig}">
            <TunnelServiceConfigItem :tunnelConfig="tunnelConfig"></TunnelServiceConfigItem>
          </template>
        </TunnelList>
      </el-tab-pane>
    </el-tabs>
    <ConfigDialog title="添加网页穿透" v-model="dialogVisible.web" width="80%">
      <TunnelWebFrom @cancel="()=>{dialogVisible.web=false}" @updateSuccess="loadTunnelData"
                     @createSuccess="loadTunnelData"></TunnelWebFrom>
    </ConfigDialog>
    <ConfigDialog title="添加服务穿透" v-model="dialogVisible.service" width="80%">
      <TunnelServiceFrom @cancel="()=>{dialogVisible.service=false}" @updateSuccess="loadTunnelData"
                         @createSuccess="loadTunnelData"></TunnelServiceFrom>
    </ConfigDialog>
  </div>
</template>
<style lang="less" scoped>
.ngrok-config-wrap {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-flow: column;
  grid-gap: 0;
}

.server-wrap, .tunnel-config-wrap {
  width: 100%;
}

.server-wrap {
  border: none;
  box-shadow: none !important;
  border-radius: 0;
}

.server-wrap-border {
  border: none;
}

.server-info {
  width: 320px;
}

.info-wrap {
  display: inline-flex;
  align-items: center;
  flex-flow: row;
  justify-content: flex-start;
  grid-gap: 12px;
}
</style>
<style>
.server-wrap {
  .el-card__body {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
  }
}

.tunnel-config-wrap {
  .el-tabs__content {
    padding: 16px;
  }

  .el-tabs__header {
    background-color: var(--server-info-bg);
  }

  .el-tabs__item:hover, .el-tabs__item.is-active {
    color: var(--el-color-success) !important;
  }

  border-bottom: none;

  .el-tabs__new-tab {
    width: fit-content;
    padding-right: 12px;
    border: none;
  }
  .el-tabs__item:hover{
    padding-left:20px!important;
  }
  .el-tabs__nav{
    .is-icon-close{
      display: none;
    }
  }
}
</style>