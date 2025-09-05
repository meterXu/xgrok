<script setup>
import MyAvatar from "@/components/header/MyAvatar.vue";
import PageNav from "@/components/header/PageNav.vue";

const props = defineProps({
  pageNav:{
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
  <el-header class="p-0 border-b-1 border-solid border-(--border-color)">
    <div class="h-56 px-0 py-16 flex items-center " :class="pageNav?'justify-between':'justify-end'">
      <PageNav :hasLock="hasLock" v-if="pageNav"></PageNav>
      <MyAvatar></MyAvatar>
    </div>
  </el-header>
</template>
