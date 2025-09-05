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
import ServiceSwitch from "@/components/control-btns/ServiceSwitch.vue";
import ConfigLockBtn from "@/components/control-btns/ConfigLockBtn.vue";
import ConfigRefreshBtn from "@/components/control-btns/ConfigRefreshBtn.vue";
import {sleep} from "@/libs/common";
import ViewLogBtn from "@/components/control-btns/ViewLogBtn.vue";
import HorizontalHeader from "@/components/header/HorizontalHeader.vue";

const store = useAppStore()
const tunnelWebConfigs = ref(null)
const tunnelServiceConfigs = ref(null)
const serviceSwitch = shallowRef()
const serverLoading = shallowRef(false)
const {selectedServer, clientId, percentage} = store

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
  if (selectedServer.value&&selectedServer.value.type===window.project.variable.type) {
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
  <HorizontalHeader></HorizontalHeader>
  <div class="ngrok-config-wrap">
    <el-card class="server-wrap" v-if="selectedServer">
      <div class="info-wrap">
        <div class="server-info">
          <ServerConfigs @changeServerConfig="onChangeServerConfig"></ServerConfigs>
        </div>
        <SystemInfo></SystemInfo>
      </div>
      <div class="flex items-center justify-center">
        <ServerProgress :percentage="percentage"></ServerProgress>
      </div>
    </el-card>
    <ConfigRefreshBtn :loading="serverLoading" @refresh="onRefresh"/>
    <ServiceSwitch ref="serviceSwitch"
                   :tunnel-service-configs="tunnelServiceConfigs"
                   :tunnel-web-configs="tunnelWebConfigs"
                   :percentage="percentage"
                   @serverLoading="(val)=>{serverLoading=val}"
    >
    </ServiceSwitch>
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
<style lang="less">
.server-wrap {
  .el-card__body {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    grid-gap: 12px;
  }
}

.tunnel-config-wrap {
  border-bottom: none;
  border-left: none;

  .el-tabs__content {
    padding: 16px;
  }

  .el-tabs__header {
    background-color: var(--server-info-bg);
  }

  .el-tabs__item:hover, .el-tabs__item.is-active {
    color: var(--el-color-success) !important;
  }

  .el-tabs__new-tab {
    width: fit-content;
    padding-right: 12px;
    border: none;
  }

  .el-tabs__item:hover {
    padding-left: 20px !important;
  }

  .el-tabs__nav {
    .is-icon-close {
      display: none;
    }
  }
}
</style>
