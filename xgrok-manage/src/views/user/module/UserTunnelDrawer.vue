<script setup lang="ts">
import {useGetIndexMethod} from "@/libs/use-curd";
import FillHeightContainer from "@/components/FillHeightContainer.vue";

const isVisible = defineModel()
const props = defineProps(['user'])
</script>

<template>
  <el-drawer v-model="isVisible" direction="rtl" size="40%">
    <template #header>
      <h2 class="text-[14px] font-bold">用户【{{user.username}}】的隧道配置</h2>
    </template>
    <template #default>
      <div class="w-full h-full flex flex-col justify-items-start items-start text-[14px] ">
        <div class="flex-1/2 flex flex-col justify-items-start items-start">
          <h3 class="text-[14px]">
            WEB配置
          </h3>
          <FillHeightContainer>
            <el-table class="rounded-2xl!" height="100%" header-row-class-name="table-header">
              <el-table-column fixed type="index" label="序号" align="center" :index="useGetIndexMethod" width="55"></el-table-column>
            </el-table>
          </FillHeightContainer>
        </div>
        <div class="flex-1/2 flex flex-col justify-items-start items-start">
          <h3 class="text-[14px]">
            服务配置
          </h3>
          <FillHeightContainer>
            <el-table class="rounded-2xl!" height="100%" header-row-class-name="table-header">
              <el-table-column fixed type="index" label="序号" align="center" :index="useGetIndexMethod" width="55"></el-table-column>
            </el-table>
          </FillHeightContainer>
        </div>
      </div>
    </template>
  </el-drawer>
</template>

<style scoped lang="less">

</style>
