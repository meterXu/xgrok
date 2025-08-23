<script setup lang="ts">
import zhCn from 'element-plus/es/locale/lang/zh-cn'

</script>

<template>
  <el-config-provider :locale="zhCn" size="small">
    <router-view/>
  </el-config-provider>
</template>

<style scoped>
</style>
