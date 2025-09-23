<script setup>
import IconParkSolidPlayOne from '~icons/icon-park-solid/play-one';
import IconParkOutlineDeleteOne from '~icons/icon-park-outline/delete-one?width=14px&height=14px';

const emits = defineEmits(['test', 'del'])

function onTest() {
  emits('test')
}

function onDel() {
  emits('del')
}
</script>

<template>
  <div
      class="tunnel-control h-42 flex flex-row items-center p-20 bg-(--primary-bg-0) border-b-1 border-(--border-color)">
    <el-button type="primary" link :icon="IconParkSolidPlayOne" @click="onTest">测试</el-button>
    <el-button type="danger" link :icon="IconParkOutlineDeleteOne" @click="onDel">删除</el-button>
  </div>
</template>

<style scoped lang="less">
.tunnel-control {
  position: relative;

  &:after {
    position: absolute;
    content: '';
    height: 2px;
    width: 0;
    bottom: 0;
    left: 0;
    background-color: var(--el-color-primary);
    animation: effect-in ease-out 3s forwards,
    color-change ease 1s infinite;
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

@keyframes color-change {
  0% {
    filter:hue-rotate(0deg)
  }
  100% {
    filter:hue-rotate(360deg)
  }

}
</style>
