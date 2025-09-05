<script setup>
import MyAvatar from "@/components/header/MyAvatar.vue";
import PageNav from "@/components/header/PageNav.vue";

</script>

<template>
  <el-header class="p-0 border-b-1 border-solid border-(--border-color)">
    <div class="h-56 px-0 py-16 flex items-center justify-between">
      <PageNav :hasLock="true"></PageNav>
      <MyAvatar></MyAvatar>
    </div>
  </el-header>
</template>
