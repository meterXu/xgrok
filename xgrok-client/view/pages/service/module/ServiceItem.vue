<script setup>
import {decryptData, getEnumKey, useMyTitle} from "@/libs/common";
import TunnelItem from "@/components/tunnel/TunnelItem.vue";
import {doCopy} from "xxweb-util";
import {showNotification} from "@/libs/message";
import {NotificationType, serviceType} from "@/libs/enums";
import {useAppStore} from "@/store";
import {storeToRefs} from 'pinia'

const props = defineProps(['item'])
const store = useAppStore()
const {selectedServer} = storeToRefs(store)


const tunnelContext = computed(() => {
  if (props.item.type === serviceType.TCP || props.item.type === serviceType.UDP) {
    return `${selectedServer.value?.domain}:${props.item.remote_port}`
  } else {
    return `${props.item.host}:${props.item.port}`
  }
})

function onCopy(item) {
  if(props.item.type === serviceType.TCP || props.item.type === serviceType.UDP){
    doCopy(selectedServer.value.domain + ':' + item.remote_port).then(() => {
      showNotification(NotificationType.success, '复制成功')
    })
  }else if(props.item.type===serviceType.STCP_CLIENT){
    doCopy(item.host + ':' + item.port).then(() => {
      showNotification(NotificationType.success, '复制成功')
    })
  } else {
    doCopy('连接信息：隧道名：'+item.name + '，密码：' + decryptData(item.secret_key)).then(() => {
      showNotification(NotificationType.success, '复制成功')
    })
  }
}

</script>

<template>
  <TunnelItem class="status flex flex-col gap-4 mx-8"
              :id="item.id" :status="item.status" :online="item.is_online">
    <span class="w-full flex items-center justify-between gap-2">
      <span class="truncate">
        {{ useMyTitle(item) }}
      </span>
      <span class="text-[9px]">{{getEnumKey(serviceType,item.type)}}</span>
    </span>
    <span class="w-full flex items-center justify-between gap-2">
        <span class="flex-1 truncate">
           <IconParkOutlineKey v-if="item.type===serviceType.STCP_SERVER||item.type===serviceType.STCP_CLIENT" class="inline -mt-2 text-[12px] hover:text-(--el-color-primary)"/>
          {{ tunnelContext }}
        </span>
      <el-tooltip content="点击复制">
        <IconParkOutlineCopy @click.stop="onCopy(item)" class="text-[12px] hover:text-(--el-color-primary)"/>
      </el-tooltip>
    </span>
  </TunnelItem>
</template>

<style scoped lang="less">
</style>
