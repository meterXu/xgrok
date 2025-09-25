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
  doCopy(selectedServer.value.domain + ':' + item.remote_port).then(() => {
    showNotification(NotificationType.success, '复制成功')
  })
}
</script>

<template>
  <TunnelItem class="status flex flex-col gap-4 mx-8"
              :class="`status-${['failed','success'][item.is_online]}`"
              :id="item.id">
    <span class="overflow-hidden text-ellipsis">{{ useMyTitle(item) }}</span>
    <span class="w-full flex items-center justify-between">
                  <span class="overflow-hidden text-ellipsis">{{ selectedServer?.domain }}:{{ item.remote_port }}</span>
                  <IconParkOutlineCopy @click="onCopy(item)" class="text-[12px] hover:text-(--el-color-primary)"/>
                </span>
  </TunnelItem>
</template>

<style scoped lang="less">
.status{
  position: relative;
  &:after {
    position: absolute;
    display: block;
    content: '';
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    z-index: 2;
  }
}
.status-success {
  &:after {
    animation: show ease-out .5s forwards;
    background: var(--el-color-success);
  }
}
.status-failed {
  &:after {
    animation: show ease-out .5s forwards;
    background: var(--el-color-danger);
  }
}
@keyframes show {
  0%{
    opacity: 0;
  }
  100%{
    opacity: 1;
  }
}
</style>
