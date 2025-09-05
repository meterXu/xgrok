<script setup>

import HorizontalHeader from "@/components/header/HorizontalHeader.vue";
import PageNav from "@/components/header/PageNav.vue";
import ConfigLockBtn from "@/components/control-btns/ConfigLockBtn.vue";
import LeftMiddle from "@/components/left-aside/LeftMiddle.vue";
import TunnelList from "@/components/tunnel/TunnelList.vue";
import {onMounted, ref} from "vue";
import {useAppStore} from "@/store";
import {queryTunnelWebConfig} from "@/api";
import ConfigDialog from "@/components/ConfigDialog.vue";
import TunnelWebFrom from "@/pages/dashboard/modules/TunnelWeb/TunnelWebFrom.vue";
import {checkPermission} from "@/libs/useAction";
import TunnelItem from '@/components/tunnel/TunnelItem.vue'
import {useMyTitle} from "@/libs/common";

const store = useAppStore()
const {selectedServer, clientId} = store
const tunnelWebConfigs = ref(null)
const tunnelLoading = ref(false)
const dialogVisible = ref(false)
const activeId = ref(null)

function loadTunnelData() {
  if (!selectedServer.value || !clientId.value) {
    return false
  }
  tunnelLoading.value = true
  queryTunnelWebConfig(selectedServer.value.id, clientId.value).then(res => {
    if (res.success) {
      tunnelWebConfigs.value = res.data
    }
  }).finally(() => {
    tunnelLoading.value = false;
    store.setIsDeleteAll(false)
    store.setDeleteIdsAll([])
  })
}

function onAddTunnel() {
  if (checkPermission('web', tunnelWebConfigs)) {
    store.setTunnelForm(null)
    dialogVisible.value = true
  }
}

function onChange(id) {
  console.log(id)
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
          <IconParkOutlineAdd class="cursor-pointer text-[16px] hover:text-(--el-color-primary)!"/>
          <ConfigLockBtn></ConfigLockBtn>
        </div>
      </div>
      <div class="px-8">
        <TunnelList @change="onChange">
          <TunnelItem v-for="item in tunnelWebConfigs" :key="item.id" :id="item.id">
            {{ useMyTitle(item) }}@{{ item.host }}
          </TunnelItem>
        </TunnelList>
      </div>
    </LeftMiddle>
    <div class="flex-1">
      <HorizontalHeader :pageNav="false"></HorizontalHeader>
    </div>
  </div>
  <ConfigDialog title="添加网页穿透" v-model="dialogVisible" width="80%">
    <TunnelWebFrom @cancel="()=>{dialogVisible.value=false}" @updateSuccess="loadTunnelData"
                   @createSuccess="loadTunnelData"></TunnelWebFrom>
  </ConfigDialog>
</template>

<style scoped lang="less">

</style>
