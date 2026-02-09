<script setup>
import {defineEmits} from 'vue'
import ServerConfigItem from "@/components/ServerConfigItem.vue";
import {useAppStore} from "@/store";
import {isOnline, payPlan, useStatusClass} from "@/libs/enums";
import {queryServersConfig} from "@/api";
import {confirm,alert} from "@/libs/common";
import {$emit} from 'xxweb-util'

const emits = defineEmits(['selectServerConfig','restart'])
const {selectedServer,setSelectedServer,plan,pid,clientId} = useAppStore()
const serverConfigs = shallowReactive([])

function onSelectConfigItem(_serverConfig) {
  if(_serverConfig.id === selectedServer.id)
    return false
  if (plan.value === payPlan.vip || _serverConfig.is_vip === payPlan.free) {
    if(pid.value){
      if(_serverConfig?.is_online === isOnline.offline){
        alert('服务不在线，不可热切换','')
      }else{
        confirm('服务正在运行中，切换将重启服务，<br/>是否继续','',{
          dangerouslyUseHTMLString:true,
          confirmButtonText: '切换',
          cancelButtonText: '否',
        }).then(()=>{
          _serverConfig.statusClass = 'server-status-checking'
          setSelectedServer(_serverConfig)
          $emit('restart')
        })
      }
    }else{
      _serverConfig.statusClass = 'server-status-checking'
      setSelectedServer(_serverConfig)
    }
  } else {
    confirm('免费计划无法使用收费服务器', '',{
      confirmButtonText: '去订阅',
      cancelButtonText: '知道了',
      confirmButtonClass: 'el-button--warning is-plain'
    }).then(() => {
      router.push({name: 'Plan'})
    })
  }
}

function loadServersConfig() {
  queryServersConfig(window.project.variable.type,clientId.value).then(res => {
    if (res.success) {
      serverConfigs.splice(0, serverConfigs.length, ...res.data.records)
      if(!selectedServer.id&&serverConfigs[0]){
        setSelectedServer(serverConfigs[0])
      }
    }
  })
}
function onSpeedTest(id){
  console.log(id)
}

onMounted(() => {
  loadServersConfig()
})

</script>

<template>
  <div class="server-list pb-16">
    <div class="server-list-item relative rounded-4xl border border-(--border-color) hover:border-(--el-color-primary)"
         :class="{'selected':item.id===selectedServer.id}"
         v-for="item in serverConfigs" :key="item.id"
        @click="onSelectConfigItem(item)">
      <div class="flex flex-col cursor-pointer">
        <ServerConfigItem class="border-none h-140"  :serverConfig="item" :statusClass="useStatusClass(item.is_online)">
          <template #right-top-icon>
            <el-tooltip effect="dark" content="点击可测速">
              <div class="text-[12px] text-(--el-color-danger) select-none" @click.stop="onSpeedTest">123 ms</div>
            </el-tooltip>
          </template>
          <div class="flex justify-between text-[12px] ">
            <el-tooltip effect="dark" content="当前设备隧道数/总隧道数">
              <div class="inline-flex gap-12">
                <span class="inline-block">网页：<span class="font-bold text-(--el-color-primary)">{{item.user_web_tunnel_count}}</span>/{{item.web_tunnel_count}}</span>
                <span class="inline-block">服务：<span class="font-bold text-(--el-color-primary)">{{item.user_service_tunnel_count}}</span>/{{item.service_tunnel_count}}</span>
              </div>
            </el-tooltip>
          </div>
        </ServerConfigItem>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.server-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 32px;

}
.server-list-item.selected{
  border: 2px solid var(--el-color-primary);
  margin: -3px!important;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 20px;
    height: 20px;
    background-color: var(--el-color-success);
    border-bottom-left-radius: 8px;
    background-image: url(@/assets/imgs/check-white.svg);
    background-repeat: no-repeat;
    background-size: 12px;
    background-position: center center;
  }
}
</style>
