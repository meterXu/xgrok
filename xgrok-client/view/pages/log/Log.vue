<script setup>
import {useGoBack} from "@/libs/useAction";
</script>

<template>
  <div class="flex w-full h-full flex-col p-12">
    <div>
      <el-button type="success" plain class="text-[14px]! py-14!" size="small" @click="useGoBack">
        <template #icon>
          <i-ep-back/>
        </template>
        返回</el-button>
    </div>
    <div class="flex-1 w-full relative overflow-hidden">
      <iframe src="http://localhost:4040/http/in" class="absolute -inset-y-108 w-full" style="height: calc(100% + 100px)"></iframe>
    </div>
  </div>
</template>

<style scoped lang="less">

</style>