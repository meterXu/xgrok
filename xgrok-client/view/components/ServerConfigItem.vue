<script setup>
import {defineProps} from 'vue'
const props = defineProps(['serverConfig','statusClass'])
</script>

<template>
  <div class="class-config-item w-full border border-(--border-color) rounded-4xl p-16 flex flex-col justify-between ">
    <div class="flex flex-row items-center justify-between">
      <span class="text-[14px] font-bold h-20 flex items-center gap-4">
        <span>{{props.serverConfig.name}}</span>
        <span class="inline-flex items-center relative top-2" v-if="serverConfig.is_vip">
          <el-icon class="vip-icon" :size="18">
              <icon-park-outline-lightning/>
          </el-icon>
        </span>
      </span>
      <slot name="right-top-icon">
        <img class="w-24 h-24 object-contain" :src="`https://webspace1.oss-cn-hangzhou.aliyuncs.com/xgrok-client/${props.serverConfig.operator}.webp`" :alt="props.serverConfig.operator"/>
      </slot>
    </div>
    <slot></slot>
    <div class="flex flex-row items-center justify-between">
      <div class="text-[14px] flex gap-4 items-center">
        <el-tag type="success" effect="plain" size="small">带宽 {{props.serverConfig.up_speed}}</el-tag>
        <el-tag type="warning" effect="plain" size="small">{{props.serverConfig.region}}</el-tag>
        <el-tag type="danger" effect="plain" size="small">{{props.serverConfig.operator||'-'}}</el-tag>
      </div>
      <div class="w-24 text-center">
        <span class="server-status relative inline-block w-12 h-12 rounded-full" :class="statusClass"></span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.free-icon{
  color: var(--el-color-success);
}
.vip-icon{
  color: var(--el-color-warning);
}
.server-status{
  background-color: var(--server-status-bg);
  &:before{
    position: absolute;
    display: inline-block;
    content: '';
    left: 50%;
    top: 50%;
    width: 150%;
    height: 150%;
    border-radius: 50%;
    border: 1px solid var(--border-color-2);
    transform: translate(-50%, -50%);
  }
}
.server-status-online{
  background-color: var(--el-color-success);
  &:before{
    border: 1px solid var(--el-color-success-2);
  }
}
.server-status-offline{
  background-color: var(--el-color-danger);
  &:before{
    border: 1px solid var(--el-color-danger-2);
  }
}

.server-status-checking{
  animation: checking .8s ease-in-out infinite;
}

@keyframes checking{
  0%{
    background-color: var(--server-status-bg);
    width: 12px;
    height: 12px;
    transform: translateY(0);
    &:before{
      border-color:var(--border-color-2);
    }
  }
  50%{
    width: 14px;
    height: 14px;
    background-color: var(--el-color-success-2);
    &:before{
      border-color:var(--el-color-success);
    }
  }
  100%{
    width: 12px;
    height: 12px;
    background-color: var(--server-status-bg);
    &:before{
      border-color:var(--border-color-2);
    }
  }
}
</style>
