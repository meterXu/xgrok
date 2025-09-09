<script setup>
import HorizontalHeader from "@/components/header/HorizontalHeader.vue";
import PageNav from "@/components/header/PageNav.vue";
import ConfigLockBtn from "@/components/control-btns/ConfigLockBtn.vue";
import LeftMiddle from "@/components/left-aside/LeftMiddle.vue";
import TunnelList from "@/components/tunnel/TunnelList.vue";
import {onMounted, ref} from "vue";
import {useAppStore} from "@/store";
import {queryTunnelWebConfig} from "@/api";
import TunnelWebFrom from "@/pages/web/module/TunnelWebFrom.vue";
import {checkPermission} from "@/libs/useAction";
import TunnelItem from '@/components/tunnel/TunnelItem.vue'
import {useMyTitle} from "@/libs/common";
import {httpType} from "@/libs/enums";
import TunnelFormWrap from '@/components/tunnel/TunnelFormWrap.vue'
import TunnelControl from '@/components/tunnel/TunnelControl.vue'
import EpArrowLeft from '~icons/ep/arrow-left';
import PlusScrollbar from "@/components/plus-scrollbar/PlusScrollbar.vue";

const store = useAppStore()
const {selectedServer, clientId} = store
const tunnelWebConfigs = shallowReactive([])
const tunnelLoading = ref(false)
const activeId = shallowRef(null)
const isAdd = ref(false)
const epLoadingSpinner = `<path fill="currentColor" d="M512 64a32 32 0 0 1 32 32v192a32 32 0 0 1-64 0V96a32 32 0 0 1 32-32m0 640a32 32 0 0 1 32 32v192a32 32 0 1 1-64 0V736a32 32 0 0 1 32-32m448-192a32 32 0 0 1-32 32H736a32 32 0 1 1 0-64h192a32 32 0 0 1 32 32m-640 0a32 32 0 0 1-32 32H96a32 32 0 0 1 0-64h192a32 32 0 0 1 32 32M195.2 195.2a32 32 0 0 1 45.248 0L376.32 331.008a32 32 0 0 1-45.248 45.248L195.2 240.448a32 32 0 0 1 0-45.248m452.544 452.544a32 32 0 0 1 45.248 0L828.8 783.552a32 32 0 0 1-45.248 45.248L647.744 692.992a32 32 0 0 1 0-45.248M828.8 195.264a32 32 0 0 1 0 45.184L692.992 376.32a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0m-452.544 452.48a32 32 0 0 1 0 45.248L240.448 828.8a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0" stroke-width="25.5" stroke="currentColor"/>`

const activeTunnel = computed(() => {
  return tunnelWebConfigs.find(c => c.id === activeId.value)
})
const isEmpty = computed(() => {
  return !activeId.value && !isAdd.value
})
const showTunnelCol = computed(()=>{
  return !isAdd.value&&activeId.value
})

function loadTunnelData() {
  if (!selectedServer.value || !clientId.value) {
    return false
  }
  tunnelLoading.value = true
  queryTunnelWebConfig(selectedServer.value.id, clientId.value).then(res => {
    if (res.success) {
      tunnelWebConfigs.splice(0, tunnelWebConfigs.length, ...res.data)
    }
  }).finally(() => {
    tunnelLoading.value = false;
    store.setIsDeleteAll(false)
    store.setDeleteIdsAll([])
  })
}

function onAddTunnel() {
  if (checkPermission('web', tunnelWebConfigs)) {
    activeId.value = null
    isAdd.value = true
  }
}

function httpUrl(tunnelConfig, type) {
  if (selectedServer) {
    return type === httpType.https ? `https://${tunnelConfig.name}.${selectedServer.value.domain}:${selectedServer.value.https_port}/`
        : `http://${tunnelConfig.name}.${selectedServer.value.domain}:${selectedServer.value.http_port}/`
  } else {
    return ''
  }
}

function onOpenLink(item, type) {
  const link = httpUrl(selectedServer, item, type)
  window.project.variable.mode !== 'browser' && window.electronAPI.openExternal(link)
}

function onCancel() {
  isAdd.value = false
  activeId.value=null
}

onMounted(() => {
  loadTunnelData()
})
</script>

<template>
  <div class="h-full flex flex-row justify-start items-start">
    <LeftMiddle>
      <div class="h-60 flex items-center justify-between px-20">
        <PageNav></PageNav>
        <div class="flex flex-row items-center gap-16">
          <IconParkOutlineAdd class="cursor-pointer text-[16px] hover:text-(--el-color-primary)!" @click="onAddTunnel"/>
          <ConfigLockBtn></ConfigLockBtn>
        </div>
      </div>
      <div class="flex-1 relative">
        <TunnelList class="absolute" v-model="activeId" :initSelect="false">
          <PlusScrollbar>
            <div class="flex-1 relative flex flex-col gap-12"
                 v-loading="tunnelLoading"
                 :element-loading-spinner="epLoadingSpinner"
                 element-loading-svg-view-box="0, 0, 1024, 1024"
                 element-loading-custom-class="xgrok-loading">
              <TunnelItem class="flex flex-col gap-4 mx-8" v-for="item in tunnelWebConfigs" :key="item.id"
                          :id="item.id">
                <span class="overflow-hidden text-ellipsis">{{ useMyTitle(item) }}</span>
                <span class="w-full flex items-center justify-between">
                <span class="overflow-hidden text-ellipsis">{{ httpUrl(item, httpType.https) }}</span>
                <IconParkOutlineEarth @click="onOpenLink(item,httpType.https)" class="hover:text-(--el-color-primary)"/>
              </span>
              </TunnelItem>
            </div>
          </PlusScrollbar>
        </TunnelList>
      </div>
    </LeftMiddle>
    <div class="flex-1 h-full flex flex-col">
      <HorizontalHeader :navTitle="false">
        <el-button v-if="isAdd" type="text" :icon="EpArrowLeft" @click="onCancel">返回</el-button>
        <div v-else></div>
      </HorizontalHeader>
      <TunnelFormWrap class="flex-1 flex flex-col" :isEmpty="isEmpty" @add="onAddTunnel">
        <TunnelControl v-if="showTunnelCol"></TunnelControl>
        <div class="p-20">
          <TunnelWebFrom
              :tunnelForm="activeTunnel"
              @cancel="onCancel"
              @updateSuccess="loadTunnelData"
              @createSuccess="loadTunnelData">
          </TunnelWebFrom>
        </div>
      </TunnelFormWrap>
    </div>
  </div>
</template>

<style scoped lang="less">

</style>
