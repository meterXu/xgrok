<script setup>
import {version} from '../../../../package.json'
const _version  = version
</script>

<template>
  <span class="text-[24px] font-bold mt-40">版本：v{{_version}}</span>
  <div class="text-(--text-color-2)">XGROK是一款开源的内网穿透软件，旨在为普通用户提供简单快捷的网络穿透体验。</div>
</template>

<style scoped lang="less">

</style>
