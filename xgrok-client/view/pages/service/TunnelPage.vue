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
  updateTunnelService, checkServiceByWebClient
} from "@/api";
import ServiceFrom from "./module/ServiceFrom.vue";
import {getEnumKey, confirm} from "@/libs/common";
import EpArrowLeft from '~icons/ep/arrow-left';
import TunnelEmptyCon from "@/components/tunnel/TunnelEmptyCon.vue";
import TunnelControl from "@/components/tunnel/TunnelControl.vue";
import TunnelFormWrap from "@/components/tunnel/TunnelFormWrap.vue";
import PlusScrollbar from "@/components/plus-scrollbar/PlusScrollbar.vue";
import PlusLoading from "@/components/plus-loading/PlusLoading.vue";
import {checkPermission, operationConfirm, useClientTypeExecute, useGetTunnelStatistics} from "@/libs/useAction";
import {isOnline, NotificationType, serviceType, statusType, tunnelType} from "@/libs/enums";
import {showNotification} from "@/libs/message";
import ServiceItem from "@/pages/service/module/ServiceItem.vue";
import ServiceSwitch from "@/components/control-btns/ServiceSwitch.vue";
import {$emit} from "xxweb-util";
import AddTunnelBtn from "@/components/control-btns/AddTunnelBtn.vue";

const store = useAppStore()
const {selectedServer, clientId, configIsLock,pid} = store
const tunnelServiceConfigs = reactive([])
const tunnelLoading = ref(false)
const activeId = shallowRef(null)
const isAdd = ref(false)
const search = ref('')
const testStatus = ref('')
const activeTunnel = computed(() => {
  return tunnelServiceConfigs.find(c => c.id === activeId.value)||{}
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

async function loadTunnelData() {
  if (!selectedServer || !clientId.value) {
    return false
  }
  tunnelLoading.value = true
  const res = await queryTunnelServiceConfig(selectedServer.id, clientId.value)
  if (res.success) {
    tunnelServiceConfigs.splice(0, tunnelServiceConfigs.length, ...res.data)
    activeId.value = null
  }
  tunnelLoading.value = false;
}

function onCancel() {
  isAdd.value = false
  activeId.value = null
}

function onAddTunnel() {
  if (!configIsLock && checkPermission(getEnumKey(tunnelType, tunnelType.service), tunnelServiceConfigs)) {
    activeId.value = null
    isAdd.value = true
  }
}

function onDel() {
  if (activeTunnel.value?.id) {
    confirm('确定要删除这条配置吗？', null, {
      confirmButtonClass: 'el-button--danger is-plain'
    }).then(({done}) => {
      operationConfirm(done).then(({done:done2})=>{
        deleteTunnelServiceBatch(activeTunnel.value.id).then(async (res) => {
          if (res.success) {
            showNotification(NotificationType.success, '删除成功')
            await loadTunnelData()
            pid.value&&$emit('restart')
          } else {
            showNotification(NotificationType.error, '删除失败')
          }
        }).finally(() => {
          done2()
        })
      })
    }).catch(()=>{})
  }
}

function onTest() {
  testStatus.value = 'start'
  useClientTypeExecute(()=>{
    return Promise.all([
      checkServiceByWebClient(activeTunnel.value.host, activeTunnel.value.port,activeTunnel.value.type),
      [serviceType.STCP_CLIENT,serviceType.STCP_SERVER].indexOf(activeTunnel.value.type)>-1?
          {data:true}:
          checkService(selectedServer.domain, activeTunnel.value.remote_port,activeTunnel.value.type)
    ])
  },()=>{
    return Promise.all([
      window.electronAPI.checkPort({
        host:activeTunnel.value.host,port:activeTunnel.value.port,type:activeTunnel.value.type
      }),
      [serviceType.STCP_CLIENT,serviceType.STCP_SERVER].indexOf(activeTunnel.value.type)>-1?
          {data:true}:
          checkService(selectedServer.domain, activeTunnel.value.remote_port,activeTunnel.value.type)])
  }).then(resArray => {
        activeTunnel.value.is_online = !resArray[0].data && resArray[1].data ? isOnline.online : isOnline.offline
        testStatus.value = activeTunnel.value.is_online ? 'success' : 'failed'
        updateTunnelService({
          id: activeTunnel.value.id,
          is_online: activeTunnel.value.is_online
        })
      })
}

function onToggleStatus(value){
  operationConfirm().then(({done})=>{
    updateTunnelService({
      id: activeTunnel.value.id,
      status: value
    }).then(async res=>{
      const operation = value?'启用':'禁用'
      showNotification(res.success?NotificationType.success:NotificationType.error,  res.success?`${operation}成功`:res.message||`${operation}失败`)
      if(res.success){
        pid.value&&$emit('restart')
      }
    }).finally(() => {
      done()
    })
  })
}

function onChange() {
  isAdd.value = false
  testStatus.value = ''
}
function operateSuccess(type){
  loadTunnelData()
  useGetTunnelStatistics()
  pid.value&&$emit('restart')
}
onMounted(() => {
  loadTunnelData()
  useGetTunnelStatistics()
})
</script>

<template>
  <div class="h-full flex flex-row justify-start items-start overflow-x-hidden">
    <LeftMiddle>
      <div class="h-60 flex items-center justify-between px-20">
        <PageNav></PageNav>
        <div class="flex flex-row items-center gap-16">
          <AddTunnelBtn @addTunnel="onAddTunnel"></AddTunnelBtn>
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
          <TunnelControl v-if="showTunnelCol" :status="testStatus" :tunnelStatus="activeTunnel.status"
                         @test="onTest"
                         @del="onDel"
                         @toggleStatus="onToggleStatus"
          ></TunnelControl>
          <div class="p-24">
            <ServiceFrom
                :tunnelForm="activeTunnel"
                @cancel="onCancel"
                @updateSuccess="operateSuccess('update')"
                @createSuccess="operateSuccess('create')">
            </ServiceFrom>
          </div>
        </template>
      </TunnelFormWrap>
    </div>
  </div>
  <ServiceSwitch class="invisible absolute top-0 -z-10"/>
</template>

<style scoped lang="less">

</style>
