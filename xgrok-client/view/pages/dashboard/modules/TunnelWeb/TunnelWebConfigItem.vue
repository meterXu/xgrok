<script setup>
import {defineProps} from 'vue'
import {useAppStore} from "@/store";
import {useMyTitle} from "@/libs/common";
import {httpType} from "@/libs/enums";

const props=defineProps(['tunnelConfig'])
const store = useAppStore()
const {selectedServer,isDelete,deleteIds} = store

function httpUrl(tunnelConfig,type){
  if(selectedServer.value){
    return type===httpType.https?`https://${tunnelConfig.name}.${selectedServer.value.domain}:${selectedServer.value.https_port}/`
        :`http://${tunnelConfig.name}.${selectedServer.value.domain}:${selectedServer.value.http_port}/`
  }else{
    return ''
  }
}

function colspan(tunnelConfig){
  return tunnelConfig.type===1?1:3
}

function onOpenLink(type){
  const link  = httpUrl(props.tunnelConfig,type)
  window.electronAPI.openExternal(link)
}

</script>

<template>
  <el-card class="tunnel-view">
    <table class="view-table">
      <tr class="title-wrap">
        <th colspan="4" class="title">{{useMyTitle(tunnelConfig)}} </th>
      </tr>
      <tr class="content-wrap">
        <th>代理网址</th><td colspan="3">{{tunnelConfig.host}}</td>
      </tr>
      <tr class="content-wrap">
        <th>HTTP链接</th>
        <td class="td-auto-width">
          <el-link class="tunnel-view-url" type="success" href="javascript:;" @click="onOpenLink(httpType.http)">{{httpUrl(tunnelConfig,httpType.http)}}</el-link>
        </td>
        <th>HTTPS链接</th>
        <td class="td-auto-width">
          <el-link class="tunnel-view-url" type="success" href="javascript:;" @click="onOpenLink(httpType.https)">{{httpUrl(tunnelConfig,httpType.https)}}</el-link>
        </td>
      </tr>
    </table>
  </el-card>
</template>

<style lang="less">
</style>