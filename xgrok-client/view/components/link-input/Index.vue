<script setup lang="ts">
import {nextTick} from "vue";

const model = defineModel()
const showProxyInput = ref(false)
const proxyInput = ref()
function onChangeProxyInput(){
  showProxyInput.value=!showProxyInput.value
  showProxyInput.value&&nextTick(() => {
    proxyInput.value.focus()
  })
}
function onProxyChange(){
  showProxyInput.value=false
}
</script>

<template>
  <el-input ref="proxyInput" v-if="showProxyInput" v-model="model" size="small" @change="onProxyChange"/>
  <el-link v-else size="small" type="success">{{model}}</el-link>
  <el-button class="p-0!" size="small" type="text" @click="onChangeProxyInput">{{showProxyInput?'完成':'设置'}}</el-button>
</template>

<style scoped lang="less">

</style>
