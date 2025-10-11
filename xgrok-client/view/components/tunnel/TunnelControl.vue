<script setup>
import IconParkSolidPlayOne from '~icons/icon-park-solid/play-one';
import IconParkOutlineDeleteOne from '~icons/icon-park-outline/delete-one';
import {useAppStore} from '@/store';
import {statusType} from "@/libs/enums";

const store = useAppStore();
const {configIsLock} = store
const emits = defineEmits(['test', 'del'])
const props = defineProps(['status', 'tunnelStatus'])

const isDisabled = computed(() => {
  return configIsLock.value||props.tunnelStatus === statusType.disable
})
function onTest() {
  emits('test')
}

function onDel() {
  emits('del')
}

function onToggleStatus(value) {
  emits('toggleStatus', value)
}
</script>

<template>
  <div
      class="tunnel-control h-42 flex flex-row items-center p-20 bg-(--primary-bg-3) border-b-1 border-(--border-color)"
      :class="status"
  >
    <el-button :disabled="isDisabled" :loading="status==='start'" :icon="IconParkSolidPlayOne" type="primary" link @click="onTest">测试
    </el-button>
    <el-button :disabled="isDisabled" type="danger" link :icon="IconParkOutlineDeleteOne" @click="onDel">删除
    </el-button>
    <el-switch class="ml-12" size="small" :model-value="tunnelStatus" :active-value="1" :inactive-value="0"
               @change="onToggleStatus"></el-switch>
  </div>
</template>

<style scoped lang="less">
.tunnel-control {
  position: relative;

  &:before {
    position: absolute;
    content: '';
    height: 3px;
    bottom: -2px;
    left: 0;
    background: linear-gradient(to right, transparent, var(--el-color-success));
    z-index: 2;
  }

  &:after {
    position: absolute;
    content: '';
    height: 3px;
    bottom: -2px;
    left: 0;
    z-index: 3;
  }
}

.start {
  &:before {
    animation: effect-in linear 1s forwards;
  }

  &:after {
    animation: effect-in 1s linear 1s infinite,
    color-change 1s linear 1s infinite;
  }
}

.success {
  &:before {
    animation: effect-complete linear .2s forwards,
    color-change-success .2s linear .2s forwards;
  }

  &:after {
    display: none;
  }
}

.failed {
  &:before {
    background: var(--el-color-danger);
    animation: effect-complete linear .2s forwards,
    color-change-failed .2s linear .2s forwards;
  }

  &:after {
    display: none;
  }
}

@keyframes effect-in {
  0% {
    width: 0;

  }
  100% {
    width: 80%;
  }
}

@keyframes effect-complete {
  0% {
    width: 80%;
  }
  100% {
    width: 100%;
  }
}

@keyframes color-change {
  0% {
    background: linear-gradient(to right, transparent, #52f3aa);
  }
  14% {
    background: linear-gradient(to right, transparent, #2c8af6);
  }
  28% {
    background: linear-gradient(to right, transparent, #f62ce5);
  }
  42% {
    background: linear-gradient(to right, transparent, #ea726d);
  }
  56% {
    background: linear-gradient(to right, transparent, #f6872c);
  }
  70% {
    background: linear-gradient(to right, transparent, #f6ec2c);
  }
  84% {
    background: linear-gradient(to right, transparent, #2cf64e);
  }
  100% {
    background: linear-gradient(to right, transparent, #52f3aa);
  }
}

@keyframes color-change-success {
  100% {
    background: linear-gradient(to right, var(--el-color-success), var(--el-color-success));
  }
}

@keyframes color-change-failed {
  100% {
    background: linear-gradient(to right, var(--el-color-danger), var(--el-color-danger));
  }
}
</style>
