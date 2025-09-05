<script setup>
import HorizontalHeader from "@/components/header/HorizontalHeader.vue";
import LeftCon from "@/components/left-aside/LeftCon.vue";

onMounted(() => {
})

</script>

<template>
  <div class="h-full">
    <el-container class="h-full! flex flex-row justify-start items-start">
      <LeftCon></LeftCon>
      <el-container class="flex flex-col!">
        <HorizontalHeader></HorizontalHeader>
        <el-main class="p-0! relative">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style lang="less" scoped>
.content-wrap {
  padding: 0;
  position: relative;
}
</style>
