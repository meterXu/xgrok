<script setup>
import {defineProps} from 'vue'
import {useAppStore} from "@/store";
import {useMyTitle} from "@/libs/common";
import {httpType} from "@/libs/enums";


const props=defineProps(['tunnelConfig'])
const store = useAppStore()
const {selectedServer,isDelete,deleteIds} = store

function colspan(tunnelConfig){
  return tunnelConfig.type===1?1:3
}
function httpUrl(selectedServer,tunnelConfig,type){
  if(selectedServer){
    return type===httpType.https?`https://${tunnelConfig.name}.${selectedServer.domain}:${selectedServer.https_port}/`
        :`http://${tunnelConfig.name}.${selectedServer.domain}:${selectedServer.http_port}/`
  }else{
    return ''
  }
}
function onOpenLink(type){
  const link  = httpUrl(selectedServer.value,props.tunnelConfig,type)
  window.electronAPI.openExternal(link)
}
</script>

<template>
  <div class="bg-(--tunnel-item-bg) px-20 py-12 rounded-4xl overflow-hidden text-ellipsis cursor-pointer">
    {{useMyTitle(tunnelConfig)}}@{{tunnelConfig.host}}
  </div>
</template>

<style lang="less">

</style>
