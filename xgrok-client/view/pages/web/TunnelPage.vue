<script setup>
import HorizontalHeader from "@/components/header/HorizontalHeader.vue";
import PageNav from "@/components/header/PageNav.vue";
import ConfigLockBtn from "@/components/control-btns/ConfigLockBtn.vue";
import LeftMiddle from "@/components/left-aside/LeftMiddle.vue";
import TunnelList from "@/components/tunnel/TunnelList.vue";
import {onMounted, ref} from "vue";
import {useAppStore} from "@/store";
import {deleteTunnelWebBatch, queryTunnelWebConfig} from "@/api";
import WebForm from "@/pages/web/module/WebForm.vue";
import {checkPermission} from "@/libs/useAction";
import TunnelItem from '@/components/tunnel/TunnelItem.vue'
import {useMyTitle, getEnumKey, confirm} from "@/libs/common";
import {httpType, NotificationType, tunnelType} from "@/libs/enums";
import TunnelFormWrap from '@/components/tunnel/TunnelFormWrap.vue'
import TunnelControl from '@/components/tunnel/TunnelControl.vue'
import EpArrowLeft from '~icons/ep/arrow-left';
import PlusScrollbar from "@/components/plus-scrollbar/PlusScrollbar.vue";
import TunnelEmptyCon from "@/components/tunnel/TunnelEmptyCon.vue";
import PlusLoading from "@/components/plus-loading/PlusLoading.vue";
import {showNotification} from "@/libs/message";

const store = useAppStore()
const {selectedServer, clientId, configIsLock} = store
const tunnelWebConfigs = shallowReactive([])
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

function loadTunnelData() {
  if (!selectedServer.value || !clientId.value) {
    return false
  }
  tunnelLoading.value = true
  queryTunnelWebConfig(selectedServer.value.id, clientId.value).then(res => {
    if (res.success) {
      tunnelWebConfigs.splice(0, tunnelWebConfigs.length, ...res.data)
      activeId.value = null
    }
  }).finally(() => {
    tunnelLoading.value = false;
    store.setIsDeleteAll(false)
    store.setDeleteIdsAll([])
  })
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
  window.project.variable.mode === 'browser' ? window.open(link, '_blank') : window.electronAPI.openExternal(link)
}

function onCancel() {
  isAdd.value = false
  activeId.value = null
}

function onDel() {
  if (activeTunnel.value?.id) {
    confirm('确定要删除这条配置吗？', null, {
      confirmButtonClass: 'el-button--danger is-plain'
    }).then(() => {
      deleteTunnelWebBatch(activeTunnel.value.id).then((res) => {
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
  setTimeout(() => {
    testStatus.value = 'success'
  }, 3000)
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
                <TunnelItem class="flex flex-col gap-4 mx-8" v-for="item in filterTunnelWebConfigs" :key="item.id"
                            :id="item.id">
                  <span class="overflow-hidden text-ellipsis">{{ useMyTitle(item) }}</span>
                  <span class="w-full flex items-center justify-between">
                <span class="overflow-hidden text-ellipsis">{{ httpUrl(item, httpType.https) }}</span>
                <IconParkOutlineEarth @click="onOpenLink(item,httpType.https)"
                                      class="text-[16px] hover:text-(--el-color-primary)"/>
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
        <TunnelEmptyCon v-if="isEmpty" btnText="添加网页隧道">
          <template v-slot:picture>
            <img class="opacity-70 pointer-events-none select-none" src="@/assets/imgs/no_web_tunnel.svg"
                 alt="没有隧道"/>
          </template>
        </TunnelEmptyCon>
        <template v-else>
          <TunnelControl v-if="showTunnelCol" @del="onDel" @test="onTest" :status="testStatus"></TunnelControl>
          <div class="p-20">
            <WebForm
                :tunnelForm="activeTunnel"
                @cancel="onCancel"
                @updateSuccess="loadTunnelData"
                @createSuccess="loadTunnelData">
            </WebForm>
          </div>
        </template>
      </TunnelFormWrap>
    </div>
  </div>
</template>

<style scoped lang="less">

</style>
