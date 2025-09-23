<script setup>
import HorizontalHeader from "@/components/header/HorizontalHeader.vue";
import PageNav from "@/components/header/PageNav.vue";
import ConfigLockBtn from "@/components/control-btns/ConfigLockBtn.vue";
import LeftMiddle from "@/components/left-aside/LeftMiddle.vue";
import TunnelList from "@/components/tunnel/TunnelList.vue";
import {onMounted, ref} from "vue";
import {useAppStore} from "@/store";
import {deleteTunnelServiceBatch, deleteTunnelWebBatch, queryTunnelServiceConfig} from "@/api";
import ServiceFrom from "./module/ServiceFrom.vue";
import {useMyTitle, getEnumKey, confirm} from "@/libs/common";
import TunnelItem from "@/components/tunnel/TunnelItem.vue";
import {doCopy} from 'xxweb-util'
import EpArrowLeft from '~icons/ep/arrow-left';
import TunnelEmptyCon from "@/components/tunnel/TunnelEmptyCon.vue";
import TunnelControl from "@/components/tunnel/TunnelControl.vue";
import TunnelFormWrap from "@/components/tunnel/TunnelFormWrap.vue";
import PlusScrollbar from "@/components/plus-scrollbar/PlusScrollbar.vue";
import PlusLoading from "@/components/plus-loading/PlusLoading.vue";
import {checkPermission} from "@/libs/useAction";
import {NotificationType, tunnelType} from "@/libs/enums";
import {showNotification} from "@/libs/message";

const store = useAppStore()
const {selectedServer, clientId} = store
const tunnelServiceConfigs = shallowReactive([])
const tunnelLoading = ref(false)
const activeId = shallowRef(null)
const isAdd = ref(false)
const search = ref('')
const activeTunnel = computed(() => {
  return tunnelServiceConfigs.find(c => c.id === activeId.value)
})
const isEmpty = computed(() => {
  return !activeId.value && !isAdd.value
})
const showTunnelCol = computed(() => {
  return !isAdd.value && activeId.value
})
const filterTunnelServiceConfigs = computed(()=>{
  return search.value?tunnelServiceConfigs.filter(c=>c.name.indexOf(search.value)>-1):tunnelServiceConfigs
})

function loadTunnelData() {
  if (!selectedServer.value || !clientId.value) {
    return false
  }
  tunnelLoading.value = true
  queryTunnelServiceConfig(selectedServer.value.id, clientId.value).then(res => {
    if (res.success) {
      tunnelServiceConfigs.splice(0, tunnelServiceConfigs.length, ...res.data)
      activeId.value = null
    }
  }).finally(() => {
    tunnelLoading.value = false;
    store.setIsDeleteAll(false)
    store.setDeleteIdsAll([])
  })
}

function onCopy(item) {
  doCopy(selectedServer.value.domain + ':' + item.remote_port).then(() => {
    showNotification(NotificationType.success, '复制成功')
  })
}

function onCancel() {
  isAdd.value = false
  activeId.value = null
}

function onAddTunnel() {
  if (checkPermission(getEnumKey(tunnelType, tunnelType.service), tunnelServiceConfigs)) {
    activeId.value = null
    isAdd.value = true
  }
}

function onDel() {
  if (activeTunnel.value?.id) {
    confirm('确定要删除这条配置吗？', null, {
      confirmButtonClass: 'el-button--danger is-plain'
    }).then(() => {
      deleteTunnelServiceBatch(activeTunnel.value.id).then((res) => {
        if (res.success) {
          showNotification(NotificationType.success, '删除成功')
          loadTunnelData()
        } else {
          showNotification(NotificationType.error, '删除失败')
        }
      })
    })
  }
}

function onTest(){

}

function onChange(id) {
  isAdd.value = false
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
        <TunnelList class="absolute" v-model="activeId" :initSelect="false" v-model:search="search" @change="onChange">
          <PlusScrollbar>
            <PlusLoading :loading="tunnelLoading">
              <div class="flex flex-col gap-12 mb-12">
                <TunnelItem class="flex flex-col gap-4 mx-8" v-for="item in filterTunnelServiceConfigs" :key="item.id"
                            :id="item.id">
                  <span class="overflow-hidden text-ellipsis">{{ useMyTitle(item) }}</span>
                  <span class="w-full flex items-center justify-between">
                  <span class="overflow-hidden text-ellipsis">{{ selectedServer?.domain }}:{{ item.remote_port }}</span>
                  <IconParkOutlineCopy @click="onCopy(item)" class="text-[12px] hover:text-(--el-color-primary)"/>
                </span>
                </TunnelItem>
              </div>
            </PlusLoading>
          </PlusScrollbar>
        </TunnelList>
      </div>
    </LeftMiddle>
    <div class="flex-1 h-full flex flex-col">
      <HorizontalHeader :navTitle="false">
        <el-button v-if="isAdd" type="text" :icon="EpArrowLeft" @click="onCancel">返回</el-button>
        <div v-else>
<!--          ignore-->
        </div>
      </HorizontalHeader>
      <TunnelFormWrap class="flex-1 flex flex-col" @add="onAddTunnel">
        <TunnelEmptyCon v-if="isEmpty" btnText="添加服务隧道">
          <template v-slot:picture>
            <img src="@/assets/imgs/no_service_tunnel.svg"
                 alt="没有隧道"/>
          </template>
        </TunnelEmptyCon>
        <template v-else>
          <TunnelControl v-if="showTunnelCol" @test="onTest" @del="onDel"></TunnelControl>
          <div class="p-20">
            <ServiceFrom
                :tunnelForm="activeTunnel"
                @cancel="onCancel"
                @updateSuccess="loadTunnelData"
                @createSuccess="loadTunnelData">
            </ServiceFrom>
          </div>
        </template>
      </TunnelFormWrap>
    </div>
  </div>
</template>

<style scoped lang="less">

</style>
