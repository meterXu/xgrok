<script setup>
import TunnelItem from "@/components/tunnel/TunnelItem.vue";
import {useMyTitle} from "@/libs/common";
import {httpType, NotificationType} from "@/libs/enums";
import {useAppStore} from "@/store";
import {useClientTypeExecute} from "@/libs/useAction";
import {doCopy} from 'xxweb-util'
import {showNotification} from "@/libs/message";

const props = defineProps(['item'])
const store = useAppStore()
const {selectedServer} = store

function httpUrl(tunnelConfig, type) {
  if (selectedServer) {
    return type === httpType.https ? `https://${tunnelConfig.name}.${selectedServer.domain}:${selectedServer.https_port}/`
        : `http://${tunnelConfig.name}.${selectedServer.domain}:${selectedServer.http_port}/`
  } else {
    return ''
  }
}

function onOpenLink(item, type) {
  const link = httpUrl(item, type)
  useClientTypeExecute(() => {
    window.open(link, '_blank')
  }, () => {
    window.electronAPI.openExternal(link)
  })
}

function onCopy(item, type){
  const link = httpUrl(item, type)
  doCopy(link).then(res=>{
    showNotification(NotificationType.success, '链接复制成功')
  })
}

</script>

<template>
  <TunnelItem class="status flex flex-col gap-4 mx-8"
              :id="item.id" :status="item.status" :online="item.is_online">
    <span class="overflow-hidden text-ellipsis">{{ useMyTitle(item) }}</span>
    <span class="w-full flex items-center justify-center gap-6">
                <span class="overflow-hidden text-ellipsis">{{ httpUrl(item, httpType.https) }}</span>
                <el-tooltip content="点击复制">
                  <IconParkOutlineCopy @click.stop="onCopy(item,httpType.https)" class="text-[19px] hover:text-(--el-color-primary)"/>
                </el-tooltip>
                <el-tooltip content="点击访问">
                  <IconParkOutlineEarth @click.stop="onOpenLink(item,httpType.https)" class="text-[19px] hover:text-(--el-color-primary)"/>
                </el-tooltip>
              </span>
  </TunnelItem>
</template>

<style scoped lang="less">

</style>
