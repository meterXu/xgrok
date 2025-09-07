<script setup>

import HorizontalHeader from "@/components/header/HorizontalHeader.vue";
import PageNav from "@/components/header/PageNav.vue";
import ConfigLockBtn from "@/components/control-btns/ConfigLockBtn.vue";
import LeftMiddle from "@/components/left-aside/LeftMiddle.vue";
import TunnelList from "@/components/tunnel/TunnelList.vue";
import {onMounted, ref} from "vue";
import {useAppStore} from "@/store";
import {queryTunnelWebConfig} from "@/api";
import TunnelWebFrom from "@/pages/dashboard/modules/TunnelWeb/TunnelWebFrom.vue";
import {checkPermission} from "@/libs/useAction";
import TunnelItem from '@/components/tunnel/TunnelItem.vue'
import {useMyTitle} from "@/libs/common";
import {httpType} from "@/libs/enums";
import TunnelFormWrap from '@/components/tunnel/TunnelFormWrap.vue'

const store = useAppStore()
const {selectedServer, clientId} = store
const tunnelWebConfigs = shallowReactive([])
const tunnelLoading = ref(false)
const activeId = shallowRef(null)
const isAdd = ref(false)

const activeTunnel = computed(() => {
  return tunnelWebConfigs.find(c=>c.id === activeId.value)
})
const isEmpty = computed(() => {
  return !activeId.value&&!isAdd.value
})

function loadTunnelData() {
  if (!selectedServer.value || !clientId.value) {
    return false
  }
  tunnelLoading.value = true
  queryTunnelWebConfig(selectedServer.value.id, clientId.value).then(res => {
    if (res.success) {
      tunnelWebConfigs.splice(0,tunnelWebConfigs.length,...res.data)
    }
  }).finally(() => {
    tunnelLoading.value = false;
    store.setIsDeleteAll(false)
    store.setDeleteIdsAll([])
  })
}

function onAddTunnel() {
  if (checkPermission('web', tunnelWebConfigs)) {
    activeId.value=null
    isAdd.value = true
  }
}

function httpUrl(tunnelConfig,type){
  if(selectedServer){
    return type===httpType.https?`https://${tunnelConfig.name}.${selectedServer.value.domain}:${selectedServer.value.https_port}/`
        :`http://${tunnelConfig.name}.${selectedServer.value.domain}:${selectedServer.value.http_port}/`
  }else{
    return ''
  }
}

function onOpenLink(item,type){
  const link  = httpUrl(selectedServer,item,type)
  window.project.variable.mode!=='browser'&&window.electronAPI.openExternal(link)
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
      <div class="px-8">
        <TunnelList v-model="activeId" :initSelect="false">
          <TunnelItem class="flex flex-col gap-4" v-for="item in tunnelWebConfigs" :key="item.id" :id="item.id">
            <span class="overflow-hidden text-ellipsis">{{ useMyTitle(item) }}</span>
            <span class="w-full flex items-center justify-between">
              <span class="overflow-hidden text-ellipsis">{{ httpUrl(item,httpType.https)}}</span>
              <IconParkOutlineEarth @click="onOpenLink(item,httpType.https)" class="hover:text-(--el-color-primary)"/>
            </span>
          </TunnelItem>
        </TunnelList>
      </div>
    </LeftMiddle>
    <div class="flex-1 h-full flex flex-col">
      <HorizontalHeader :pageNav="false"></HorizontalHeader>
      <TunnelFormWrap class="flex-1 flex flex-col" :isEmpty="isEmpty" @add="onAddTunnel">
        <TunnelWebFrom :data="activeTunnel"
                       @cancel="()=>{}"
                       @updateSuccess="loadTunnelData"
                       @createSuccess="loadTunnelData">
        </TunnelWebFrom>
      </TunnelFormWrap>
    </div>
  </div>
<!--  <ConfigDialog title="添加网页穿透" v-model="dialogVisible" width="80%">-->

<!--  </ConfigDialog>-->
</template>

<style scoped lang="less">

</style>
