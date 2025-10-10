<script setup>
import TunnelItem from "@/components/tunnel/TunnelItem.vue";
import {useMyTitle} from "@/libs/common";
import {httpType} from "@/libs/enums";
import {useAppStore} from "@/store";

const props = defineProps(['item'])
const store = useAppStore()
const {selectedServer} = store

function httpUrl(tunnelConfig, type) {
  if (selectedServer) {
    return type === httpType.https ? `https://${tunnelConfig.name}.${selectedServer.value.domain}:${selectedServer.value.https_port}/`
        : `http://${tunnelConfig.name}.${selectedServer.value.domain}:${selectedServer.value.http_port}/`
  } else {
    return ''
  }
}

function onOpenLink(item, type) {
  const link = httpUrl(item, type)
  window.project.variable.mode === 'browser' ? window.open(link, '_blank') : window.electronAPI.openExternal(link)
}

</script>

<template>
  <TunnelItem class="status flex flex-col gap-4 mx-8"
              :id="item.id" :status="item.status" :online="item.is_online">
    <span class="overflow-hidden text-ellipsis">{{ useMyTitle(item) }}</span>
    <span class="w-full flex items-center justify-between">
                <span class="overflow-hidden text-ellipsis">{{ httpUrl(item, httpType.https) }}</span>
                <IconParkOutlineEarth @click="onOpenLink(item,httpType.https)"
                                      class="text-[16px] hover:text-(--el-color-primary)"/>
              </span>
  </TunnelItem>
</template>

<style scoped lang="less">

</style>