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
  <el-card class="tunnel-view">
    <table class="view-table">
      <tr class="title-wrap">
        <th colspan="2" class="title">{{useMyTitle(tunnelConfig)}} </th>
      </tr>
      <tr class="content-wrap">
        <th>代理网址</th><td>{{tunnelConfig.host}}</td>
      </tr>
      <tr class="content-wrap">
        <th>HTTP链接</th>
        <td class="td-auto-width">
          <el-link class="tunnel-view-url" type="success" href="javascript:;" @click="onOpenLink(httpType.http)">{{httpUrl(selectedServer,tunnelConfig,httpType.http)}}</el-link>
        </td>
      </tr>
      <tr class="content-wrap">
        <th>HTTPS链接</th>
        <td class="td-auto-width">
          <el-link class="tunnel-view-url" type="success" href="javascript:;" @click="onOpenLink(httpType.https)">{{httpUrl(selectedServer,tunnelConfig,httpType.https)}}</el-link>
        </td>
      </tr>
    </table>
  </el-card>
</template>

<style lang="less">

</style>