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
  &:before {
    position: absolute;
    content: '';
    height: 3px;
    bottom: -2px;
    left: 0;
    background:linear-gradient(to right, transparent, var(--el-color-success));
    z-index: 2;
  }
  &:after{
    position: absolute;
    content: '';
    height: 3px;
    bottom: -2px;
    left: 0;
    z-index: 3;
  }
}
.start{
  &:before{
    animation: effect-in linear 1s forwards;
  }
  &:after{
    animation: effect-in 1s linear 1s infinite,
    color-change 1s linear 1s infinite;
  }
}
.success{
  &:before{
    animation: effect-complete linear .3s forwards,
    effect-success .3s linear .3s forwards;
  }
  &:after{
    animation: effect-in .3s linear forwards,
    color-change .3s linear forwards,
    color-change-complete .3s linear .3s forwards;
  }
}
.failed{
  &:before{
    animation: effect-complete linear .3s forwards,
    effect-failed 1s linear .3s forwards;
  }
  &:after{
    animation: effect-in .3s linear forwards,
    color-change .3s linear forwards,
    color-change-complete .3s linear .3s forwards;
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
@keyframes effect-success {
  100% {
    width: 100%;
    background:var(--el-color-success);
  }
}
@keyframes effect-failed {
  100% {
    width: 100%;
    background:var(--el-color-danger);
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
    background-color: #52f3aa;
  }
  14% {
    background-color: #2c8af6;
  }
  28%{
    background-color: #f62ce5;
  }
  42% {
    background-color: #ea726d;
  }
  56% {
    background-color: #f6872c;
  }
  70% {
    background-color: #f6ec2c;
  }
  84% {
    background-color: #2cf64e;
  }
  100%{
    background-color: #52f3aa;
  }
}
@keyframes color-change-complete {
  0%{
    visibility: visible;
  }
  100%{
    visibility: hidden;
  }
}
</style>
