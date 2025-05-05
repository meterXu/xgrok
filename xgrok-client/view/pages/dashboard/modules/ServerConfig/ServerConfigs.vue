<script setup>
import {computed, ref} from 'vue'
import ServerList from "@/pages/dashboard/modules/ServerConfig/ServerList.vue";
import ServerConfigItem from "@/components/ServerConfigItem.vue";
import ConfigDialog from "@/components/ConfigDialog.vue";
import {useAppStore} from "@/store";
import {payPlan, useStatusClass} from "@/libs/enums";
import {confirm} from "@/libs/common";
import {useRouter} from "vue-router";

const emits = defineEmits(['change','changeServerConfig'])
const store = useAppStore()
const router = useRouter()
const {selectedServer,pid,plan} = store
const serverConfigDialogVisible = ref(false)

function showServerConfigDialog(){
  serverConfigDialogVisible.value=true
}
function onSelectServerConfig(_serverConfig){
  if(plan.value===payPlan.vip||_serverConfig.is_vip===payPlan.free){
    emits('changeServerConfig',_serverConfig)
    serverConfigDialogVisible.value=false
  }else{
    confirm('免费计划无法使用收费服务器', '无法切换',{
      confirmButtonText:'去订阅',
      cancelButtonText:'知道了',
      confirmButtonClass:'my-info-btn-warning'
    }).then(()=>{
      router.push({name:'Plan'})
    })
  }
}

</script>

<template>
  <ServerConfigItem :serverConfig="selectedServer" :statusClass="selectedServer.statusClass">
    <el-button class="switch-btn no-border" @click="showServerConfigDialog" type="success" plain :disabled="Boolean(pid)">
      <template #icon>
        <i-ep-switch class="w-3.5"/>
      </template>
      切换</el-button>
  </ServerConfigItem>
  <ConfigDialog v-model="serverConfigDialogVisible" title="服务器选择" width="80%">
    <template #default="{serverConfigs}">
      <ServerList :serverConfigs="serverConfigs" @selectServerConfig="onSelectServerConfig">
      </ServerList>
    </template>
  </ConfigDialog>
</template>

<style lang="less" scoped>

</style>