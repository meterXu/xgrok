<script setup lang="ts">
import {ref} from 'vue'
import DrawerSubTitle from "@/components/DrawerSubTitle.vue";
const isVisible = defineModel()
const {server} = defineProps<{
  server:ServerType
}>()
const portLoading  = ref(false)
</script>

<template>
<el-drawer v-model="isVisible" direction="rtl" size="40%" header-class="mb-0! p-20!" body-class="p-20!">
  <template #header>
    <h2 class="text-[14px] font-bold">服务【{{server.name}}】的端口配置</h2>
  </template>
  <template #default>
    <DrawerSubTitle :loading="portLoading"
                    @click="()=>{}">
      WEB配置
    </DrawerSubTitle>
  </template>
</el-drawer>
</template>

<style scoped lang="less">

</style>