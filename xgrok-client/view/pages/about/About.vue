<script setup>

import Logo from "@/components/Logo.vue";
import PlusScrollbar from "@/components/plus-scrollbar/PlusScrollbar.vue";
import HorizontalHeader from "@/components/header/HorizontalHeader.vue";
import Release from "./module/Release.vue";
import Contact from "./module/Contact.vue";
import Information from "./module/Information.vue";
import LinkGroup from "./module/LinkGroup.vue";
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
            <div class="inline-flex flex-col gap-24">
              <information/>
              <LinkGroup/>
              <Contact/>
              <release/>
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
