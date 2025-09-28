<script setup>
import HorizontalHeader from "@/components/header/HorizontalHeader.vue";
import PageNav from "@/components/header/PageNav.vue";
import ConfigLockBtn from "@/components/control-btns/ConfigLockBtn.vue";
import LeftMiddle from "@/components/left-aside/LeftMiddle.vue";
import TunnelList from "@/components/tunnel/TunnelList.vue";
import {onMounted, ref} from "vue";
import {useAppStore} from "@/store";
import {
  deleteTunnelServiceBatch,
  queryTunnelServiceConfig,
  checkService,
  updateTunnelService
} from "@/api";
import ServiceFrom from "./module/ServiceFrom.vue";
import {getEnumKey, confirm} from "@/libs/common";
import EpArrowLeft from '~icons/ep/arrow-left';
import TunnelEmptyCon from "@/components/tunnel/TunnelEmptyCon.vue";
import TunnelControl from "@/components/tunnel/TunnelControl.vue";
import TunnelFormWrap from "@/components/tunnel/TunnelFormWrap.vue";
import PlusScrollbar from "@/components/plus-scrollbar/PlusScrollbar.vue";
import PlusLoading from "@/components/plus-loading/PlusLoading.vue";
import {checkPermission} from "@/libs/useAction";
import {isOnline, NotificationType, tunnelType} from "@/libs/enums";
import {showNotification} from "@/libs/message";
import ServiceItem from "@/pages/service/module/ServiceItem.vue";

const store = useAppStore()
const {selectedServer, clientId, configIsLock} = store
const tunnelServiceConfigs = reactive([])
const tunnelLoading = ref(false)
const activeId = shallowRef(null)
const isAdd = ref(false)
const search = ref('')
const testStatus = ref('')
const activeTunnel = computed(() => {
  return tunnelServiceConfigs.find(c => c.id === activeId.value)
})
const isEmpty = computed(() => {
  return !activeId.value && !isAdd.value
})
const showTunnelCol = computed(() => {
  return !isAdd.value && activeId.value
})
const filterTunnelServiceConfigs = computed(() => {
  return search.value ? tunnelServiceConfigs.filter(c => c.name.indexOf(search.value) > -1) : tunnelServiceConfigs
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
  })
}

function onCancel() {
  isAdd.value = false
  activeId.value = null
}

function onAddTunnel() {
  if (!configIsLock.value && checkPermission(getEnumKey(tunnelType, tunnelType.service), tunnelServiceConfigs)) {
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

function onTest() {
  testStatus.value = 'start'
  Promise.all([
    window.electronAPI.checkPort(activeTunnel.value.port),
    checkService(selectedServer.value.domain, activeTunnel.value.remote_port)])
      .then(resArray => {
        activeTunnel.value.is_online = !resArray[0].data && resArray[1].data ? isOnline.online : isOnline.offline
        testStatus.value = activeTunnel.value.is_online ? 'success' : 'failed'
        updateTunnelService({
          id: activeTunnel.value.id,
          is_online: activeTunnel.value.is_online
        })
      })
}

function onChange(id) {
  isAdd.value = false
  testStatus.value = ''
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
          <IconParkOutlineAdd class="text-[16px] hover:text-(--el-color-primary)!"
                              :class="configIsLock?'cursor-not-allowed':'cursor-pointer'"
                              @click="onAddTunnel"/>
          <ConfigLockBtn></ConfigLockBtn>
        </div>
      </div>
      <div class="flex-1 relative">
        <TunnelList class="absolute" v-model="activeId" :initSelect="false" v-model:search="search" @change="onChange">
          <PlusScrollbar>
            <PlusLoading :loading="tunnelLoading">
              <div class="flex flex-col gap-12 mb-12">
                <ServiceItem v-for="item in filterTunnelServiceConfigs" :item="item" :key="item.id"></ServiceItem>
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
          <TunnelControl v-if="showTunnelCol" :status="testStatus" @test="onTest" @del="onDel"></TunnelControl>
          <div class="p-24">
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
