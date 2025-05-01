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
import {onMounted, onUnmounted, ref, watch} from 'vue'
import {ElMessage} from 'element-plus'
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
import {isOnline} from "@/libs/enums";
import {Refresh, Lock, Unlock,Check} from "@element-plus/icons-vue";
import {$off, $on} from 'xxweb-box/utils/gogocodeTransfer'
import bus from "@/libs/bus";
const store = useAppStore()
const serverConfigs = ref(null)
const tunnelWebConfigs = ref(null)
const tunnelServiceConfigs = ref(null)
const tunnelLoading = ref(true)
const switchLoading = ref(false)
const systemInfo = ref(null)
const progressWidth = ref(85)
const {pid, selectedServer, dialogVisible, clientId} = store

if (window.project.variable.mode !== 'browser') {
  window.electronAPI.onAppQuit(() => {
    closeWebSocket()
    store.setPid(null)
  })
  window.electronAPI.onRefreshPid((pid) => {
    store.setPid(pid)
  })
}

onMounted(async () => {
  await initServerConfigData()
  await initClient()
  loadTunnelData()
})

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

function onTurnOn() {
  store.setIsDeleteAll(false)
  store.setDeleteIdsAll([])
  if (selectedServer.value && (tunnelWebConfigs.value?.length > 0 || tunnelServiceConfigs.value?.length > 0)) {
    switchLoading.value = true
    let data = {
      server: selectedServer.value,
      tunnelWebs: tunnelWebConfigs.value,
      tunnelServices: tunnelServiceConfigs.value
    }
    window.electronAPI.turnOn(JSON.parse(JSON.stringify(data))).then(res => {
      if (res.success) {
        store.setPid(res.data.pid)
      } else {
        alert('打开失败，' + res.message)
      }
    }).finally(() => {
      switchLoading.value = false
    })
  } else {
    ElMessage.warning('没有任何配置，请先添加')
  }
}

function onTurnOff() {
  store.setIsDeleteAll(false)
  store.setDeleteIdsAll([])
  switchLoading.value = true
  window.electronAPI.turnOff(pid.value).then(res => {
    if (res.success) {
      store.setPid(null)
    } else {
      alert('关闭失败')
    }
  }).finally(() => {
    switchLoading.value = false
  })
}

function onSwitchChange(value) {
  if (value) {
    if (selectedServer.value.is_online === isOnline.online)
      onTurnOn()
  } else {
    onTurnOff()
  }
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

watch(() => selectedServer?.value?.id, (nv, ov) => {
  sendMessage({type: 'closeCheckServer', server_id: ov})
  sendMessage({
    type: 'openCheckServer',
    baseApi: window.project.variable.baseApi,
    server_id: nv,
    domain: selectedServer?.value?.domain,
    port: selectedServer?.value?.port
  })
}, {immediate: true, deep: true})
onMounted(()=>{
  bus.$on('processWidth',(ratio)=>{
    progressWidth.value = 85*ratio.toFixed(2)
  })
})
onUnmounted(() => {
  sendMessage({type: 'closeCheckServer', server_id: selectedServer?.value?.id})
  $off('processWidth')
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
        <el-progress :width="progressWidth" :stroke-width="8" type="dashboard" :percentage="0" color="#67c23a">
          <template #default="{ percentage }">
            <span class="text-[16px] font-bold">{{ percentage }}%</span>
          </template>
        </el-progress>
      </div>
    </el-card>
    <el-tabs class="tunnel-config-wrap" type="border-card" editable v-loading="tunnelLoading">
      <template #add-icon>
        <div class="flex flex-row items-center justify-between gap-2">
          <div>
            <el-button plain size="small" circle :icon="Lock"></el-button>
          </div>
          <div>
            <el-button plain size="small" circle :icon="Refresh"></el-button>
          </div>
          <el-tooltip class="box-item" :popper-options="{modifiers:[{name:'offset',options:{offset:[100, 0]}}]}"
                      :disabled="selectedServer.is_online===isOnline.online" effect="light" content="服务不可用"
                      placement="top">
            <el-switch size="large" :model-value="Boolean(pid)"
                       :loading="switchLoading"
                       :disabled="selectedServer.is_online===isOnline.offline"
                       :style="['--el-switch-on-color: var(--el-color-success)',selectedServer.is_online===isOnline.offline&&'--el-switch-off-color: var(--el-color-danger)']"
                       @change="onSwitchChange"
            ></el-switch>
          </el-tooltip>
        </div>
      </template>
      <el-tab-pane label="网页">
        <TunnelList type="web" :tunnelConfigs="tunnelWebConfigs" @deleteComplete="loadTunnelData">
          <template #default="{tunnelConfig}">
            <TunnelWebConfigItem :tunnelConfig="tunnelConfig"></TunnelWebConfigItem>
          </template>
        </TunnelList>
      </el-tab-pane>
      <el-tab-pane label="服务">
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