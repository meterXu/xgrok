<script setup>
import HorizontalHeader from "@/components/header/HorizontalHeader.vue";
import PageNav from "@/components/header/PageNav.vue";
import ConfigLockBtn from "@/components/control-btns/ConfigLockBtn.vue";
import LeftMiddle from "@/components/left-aside/LeftMiddle.vue";
import TunnelList from "@/components/tunnel/TunnelList.vue";
import {onMounted, ref} from "vue";
import {useAppStore} from "@/store";
import {checkWeb, checkWebByWebClient, deleteTunnelWebBatch, queryTunnelWebConfig, updateTunnelWeb} from "@/api";
import WebForm from "@/pages/web/module/WebForm.vue";
import {checkPermission, operationConfirm, useClientTypeExecute} from "@/libs/useAction";
import {getEnumKey, confirm} from "@/libs/common";
import {isOnline, NotificationType, statusType, tunnelType} from "@/libs/enums";
import TunnelFormWrap from '@/components/tunnel/TunnelFormWrap.vue'
import TunnelControl from '@/components/tunnel/TunnelControl.vue'
import EpArrowLeft from '~icons/ep/arrow-left';
import PlusScrollbar from "@/components/plus-scrollbar/PlusScrollbar.vue";
import TunnelEmptyCon from "@/components/tunnel/TunnelEmptyCon.vue";
import PlusLoading from "@/components/plus-loading/PlusLoading.vue";
import {showNotification} from "@/libs/message";
import WebItem from "@/pages/web/module/WebItem.vue";
import {$emit} from "xxweb-util";
import ServiceSwitch from "@/components/control-btns/ServiceSwitch.vue";
import AddTunnelBtn from "@/components/control-btns/AddTunnelBtn.vue";

const store = useAppStore()
const {selectedServer, clientId, configIsLock,pid,setTunnelCountWeb,setActiveTunnelCountWeb} = store
const tunnelWebConfigs = reactive([])
const tunnelLoading = ref(false)
const activeId = shallowRef(null)
const isAdd = ref(false)
const search = ref('')
const testStatus = ref('')
const activeTunnel = computed(() => {
  return tunnelWebConfigs.find(c => c.id === activeId.value)
})
const isEmpty = computed(() => {
  return !activeId.value && !isAdd.value
})
const showTunnelCol = computed(() => {
  return !isAdd.value && activeId.value
})
const filterTunnelWebConfigs = computed(() => {
  return search.value ? tunnelWebConfigs.filter(c => c.name.indexOf(search.value) > -1) : tunnelWebConfigs
})

async function loadTunnelData() {
  if (!selectedServer || !clientId.value) {
    return false
  }
  tunnelLoading.value = true
  const res = await queryTunnelWebConfig(selectedServer.id, clientId.value)
  if (res.success) {
    tunnelWebConfigs.splice(0, tunnelWebConfigs.length, ...res.data)
    activeId.value = null
    setTunnelCountWeb(tunnelWebConfigs)
  }
  tunnelLoading.value = false;
}

function onAddTunnel() {
  if (!configIsLock.value && checkPermission(getEnumKey(tunnelType, tunnelType.web), tunnelWebConfigs)) {
    activeId.value = null
    isAdd.value = true
  }
}

function onChange(id) {
  isAdd.value = false
  testStatus.value = ''
}

function onCancel() {
  isAdd.value = false
  activeId.value = null
}

function onDel() {
  if (activeTunnel.value?.id) {
    confirm('确定要删除这条配置吗？', null, {
      confirmButtonClass: 'el-button--danger is-plain'
    }).then(({done}) => {
      operationConfirm(done).then(({done:done2})=>{
        deleteTunnelWebBatch(activeTunnel.value.id).then(async(res) => {
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
    })
  }
}

function onTest() {
  testStatus.value = 'start'
  useClientTypeExecute(()=>{
    return Promise.all([
        checkWebByWebClient(activeTunnel.value.name, selectedServer.domain, selectedServer.http_port),
        checkWeb(activeTunnel.value.name, selectedServer.domain, selectedServer.http_port)
    ])
  },()=>{
    return Promise.all([
      window.electronAPI.checkWeb({
        name: activeTunnel.value.name,
        domain: selectedServer.domain,
        port: selectedServer.http_port
      }),
      checkWeb(activeTunnel.value.name, selectedServer.domain, selectedServer.http_port)
    ])
  }).then(resArray => {
    activeTunnel.value.is_online = resArray[0].data && resArray[1].data ? isOnline.online : isOnline.offline
    testStatus.value = activeTunnel.value.is_online ? 'success' : 'failed'
    updateTunnelWeb({
      id: activeTunnel.value.id,
      is_online: activeTunnel.value.is_online
    })
  })
}

function onToggleStatus(value){
  operationConfirm().then(({done})=>{
    updateTunnelWeb({
      id: activeTunnel.value.id,
      status: value
    }).then(async res=>{
      const operation = value?'启用':'禁用'
      showNotification(res.success?NotificationType.success:NotificationType.error,  res.success?`${operation}成功`:res.message||`${operation}失败`)
      if(res.success){
        activeTunnel.value.status=value
        setActiveTunnelCountWeb(activeTunnel.value)
        pid.value&&$emit('restart')
      }
    }).finally(() => {
      done()
    })
  })
}

async function operateSuccess(type){
  await loadTunnelData()
  pid.value&&$emit('restart')
}
onMounted(() => {
  loadTunnelData()
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
                <WebItem v-for="item in filterTunnelWebConfigs" :key="item.id" :item="item"></WebItem>
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
        <TunnelEmptyCon v-if="isEmpty" btnText="添加网页隧道">
          <template v-slot:picture>
            <img class="opacity-70 pointer-events-none select-none" src="@/assets/imgs/no_web_tunnel.svg"
                 alt="没有隧道"/>
          </template>
        </TunnelEmptyCon>
        <template v-else>
          <TunnelControl v-if="showTunnelCol"
                         @del="onDel"
                         @test="onTest"
                         @toggleStatus="onToggleStatus"
                         :status="testStatus" :tunnelStatus="activeTunnel.status"></TunnelControl>
          <div class="p-24">
            <WebForm
                :tunnelForm="activeTunnel"
                @cancel="onCancel"
                @updateSuccess="operateSuccess('update')"
                @createSuccess="operateSuccess('create')">
            </WebForm>
          </div>
        </template>
      </TunnelFormWrap>
    </div>
  </div>
  <ServiceSwitch class="invisible absolute top-0 -z-10"/>
</template>

<style scoped lang="less">

</style>
