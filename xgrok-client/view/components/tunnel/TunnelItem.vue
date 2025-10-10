<script setup>
import bus from '@/libs/bus'
import {statusType} from "@/libs/enums";

const props = defineProps(['id', 'online', 'status']);

const activeId = inject('activeId');
const initSelect = inject('initSelect');
const isActive = computed(() => {
  return activeId && props.id && activeId === props.id && props.status === statusType.enable
})

function onClick() {
  bus.$emit('tunnel:Item:click', props.id);
}

onMounted(() => {
  if (!activeId.value && initSelect) {
    bus.$emit('tunnel:Item:init-select', props.id);
  }
})
</script>

<template>
  <div @click="onClick" class="hover:bg-(--tunnel-item-bg) px-20 py-12 rounded-4xl overflow-hidden text-ellipsis cursor-pointer
  border-1 border-(--border-color) font-bold"
       :class="[
                  isActive?'bg-(--tunnel-item-bg) text-(--el-color-primary)!':'',
                  ['status-failed','status-success'][props.online],
                  ['status-disabled','status-enable'][props.status]
              ]"
  >
    <slot/>
  </div>
</template>

<style scoped lang="less">
.status {
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

.status-disabled {
  &:after {
    animation: show ease-out .5s forwards;
    background: var(--el-color-disabled);
  }

  color: var(--el-color-disabled);
}

@keyframes show {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
