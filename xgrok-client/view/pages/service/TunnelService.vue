<script setup>
import HorizontalHeader from "@/components/header/HorizontalHeader.vue";
import PageNav from "@/components/header/PageNav.vue";
import ConfigLockBtn from "@/components/control-btns/ConfigLockBtn.vue";
import LeftMiddle from "@/components/left-aside/LeftMiddle.vue";
import TunnelList from "@/components/tunnel/TunnelList.vue";
import {onMounted, ref} from "vue";
import {useAppStore} from "@/store";
import {queryTunnelServiceConfig} from "@/api";
import TunnelServiceFrom from "@/pages/dashboard/modules/TunnelService/TunnelServiceFrom.vue";
import ConfigDialog from "@/components/ConfigDialog.vue";
import {useMyTitle} from "@/libs/common";
import TunnelItem from "@/components/tunnel/TunnelItem.vue";

const store = useAppStore()
const {selectedServer, clientId} = store
const tunnelServiceConfigs = ref(null)
const tunnelLoading = ref(false)
const dialogVisible = ref(false)

function loadTunnelData() {
  if (!selectedServer.value || !clientId.value) {
    return false
  }
  tunnelLoading.value = true
  queryTunnelServiceConfig(selectedServer.value.id, clientId.value).then(res => {
    if (res.success) {
      tunnelServiceConfigs.value = res.data
    }
  }).finally(() => {
    tunnelLoading.value = false;
    store.setIsDeleteAll(false)
    store.setDeleteIdsAll([])
  })
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
          <TunnelItem v-for="item in tunnelServiceConfigs" :key="item.id" :id="item.id">
            {{useMyTitle(item)}}@{{item.host}}
          </TunnelItem>
        </TunnelList>
      </div>
    </LeftMiddle>
    <div class="flex-1">
      <HorizontalHeader :pageNav="false"></HorizontalHeader>
    </div>
  </div>
  <ConfigDialog title="添加服务穿透" v-model="dialogVisible" width="80%">
    <TunnelServiceFrom @cancel="()=>{dialogVisible.value=false}" @updateSuccess="loadTunnelData"
                       @createSuccess="loadTunnelData"></TunnelServiceFrom>
  </ConfigDialog>
</template>

<style scoped lang="less">

</style>
