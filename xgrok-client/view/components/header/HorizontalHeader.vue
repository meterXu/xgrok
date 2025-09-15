<script setup>
import MyAvatar from "@/components/header/MyAvatar.vue";
import PageNav from "@/components/header/PageNav.vue";

const props = defineProps({
  navTitle:{
    type: Boolean,
    default: true
  },
  hasLock:{
    type: Boolean,
    default: true
  }
})
</script>

<template>
  <el-header class="p-0 border-b-1 border-solid bg-(--primary-bg-0) border-(--border-color)">
    <div class="h-full px-0 py-16 flex items-center justify-between">
      <slot>
        <PageNav></PageNav>
      </slot>
      <MyAvatar></MyAvatar>
    </div>
  </el-header>
</template>
