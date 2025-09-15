<script setup>

import Logo from "@/components/Logo.vue";
import PlusScrollbar from "@/components/plus-scrollbar/PlusScrollbar.vue";
import HorizontalHeader from "@/components/header/HorizontalHeader.vue";
</script>

<template>
  <div class="h-full flex flex-col">
    <HorizontalHeader :hasLock="false"></HorizontalHeader>
    <div class="h-full flex-1 relative flex flex-row gap-12">
      <div class="w-300 h-full flex flex-col justify-center items-center">
        <Logo class="about-logo" title="XGROK" direction="vertical" size="120px"></Logo>
      </div>
      <div class="flex-1 relative">
        <div class="absolute h-full py-12 w-full">
          <plus-scrollbar>
            <div class="inline-flex flex-col gap-12">
              <div class="flex flex-col gap-8">
                <span class="text-[24px] font-bold mt-40">版本：V1.1.4</span>
                <div>xgrok是一款内网穿透软件，旨在为普通用户提供简单快捷的网络穿透体验。</div>
                <div class="flex flex-row gap-8">
                  <el-button type="primary" plain>检查更新</el-button>
                  <el-button type="primary" plain>官方网站</el-button>
                  <el-button type="primary" plain>建议反馈</el-button>
                </div>
              </div>
              <div>
                <div class="mt-12 mb-48">qq群 1035160464</div>
                <div class="mt-12 mb-48">微信群</div>
              </div>
              <div>
                <div class="text-center">更新日志</div>
                <div class="h-1200">
                  xxxx
                </div>
              </div>
            </div>
          </plus-scrollbar>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less">
.about-logo{
  span{
    font-size: 60px;
  }
}
</style>
