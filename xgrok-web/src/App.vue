<script setup>
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

</script>

<template>
  <el-config-provider :locale="zhCn"
                      :autoInsertSpace="true">
    <router-view/>
  </el-config-provider>
</template>

<style scoped>
</style>
