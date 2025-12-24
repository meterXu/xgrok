<script setup>

import {useMyTitle} from "@/libs/common";
import TunnelItem from "@/components/tunnel/TunnelItem.vue";
import {doCopy} from "xxweb-util";
import {showNotification} from "@/libs/message";
import {NotificationType} from "@/libs/enums";
import {useAppStore} from "@/store";

const props = defineProps(['item'])
const store = useAppStore()
const {selectedServer} = store

function onCopy(item) {
  doCopy(selectedServer.domain + ':' + item.remote_port).then(() => {
    showNotification(NotificationType.success, '复制成功')
  })
}
</script>

<template>
  <TunnelItem class="status flex flex-col gap-4 mx-8"
              :id="item.id" :status="item.status" :online="item.is_online">
    <span class="overflow-hidden text-ellipsis">{{ useMyTitle(item) }}</span>
    <span class="w-full flex items-center justify-between">
                  <span class="overflow-hidden text-ellipsis">{{ selectedServer?.domain }}:{{ item.remote_port }}</span>
                  <el-tooltip content="点击复制">
                    <IconParkOutlineCopy @click.stop="onCopy(item)" class="text-[12px] hover:text-(--el-color-primary)"/>
                  </el-tooltip>
                </span>
  </TunnelItem>
</template>

<style scoped lang="less">
</style>
