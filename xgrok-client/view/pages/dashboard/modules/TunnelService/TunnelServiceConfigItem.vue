<script setup>
import {defineProps,defineEmits} from 'vue'
import {useAppStore} from "@/store";
import {useMyTitle} from "@/libs/common";
import {useServiceTypeText} from "@/libs/enums";

const props=defineProps(['tunnelConfig'])
const store = useAppStore()
const {selectedServer} = store
const emits = defineEmits(['delSelectChange'])

</script>

<template>
  <el-card class="tunnel-view">
    <table class="view-table">
      <tr class="title-wrap"><th colspan="2" class="title">{{useMyTitle(tunnelConfig)}}</th></tr>
      <tr class="content-wrap">
        <th>代理地址</th>
        <td class="td-auto-width">{{tunnelConfig.host}}:{{tunnelConfig.port}}</td>
      </tr>
      <tr class="content-wrap">
        <th>映射地址</th><td>
        <el-link class="tunnel-view-url" type="success" :underline="false">
          {{selectedServer?selectedServer.domain:''}}:{{tunnelConfig.remote_port}}
        </el-link>
      </td>
      </tr>
    </table>
  </el-card>
</template>

<style scoped lang="less">
</style>