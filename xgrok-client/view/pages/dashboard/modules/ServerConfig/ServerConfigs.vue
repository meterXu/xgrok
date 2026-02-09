<script setup>
import ServerConfigItem from "@/components/ServerConfigItem.vue";
import {useAppStore} from "@/store";

const emits = defineEmits(['change'])
const props = defineProps(['tunnelCount'])
const store = useAppStore()
const {selectedServer} = store

</script>

<template>
  <ServerConfigItem class="server-configs border-none bg-(--primary-bg-0) h-full" :serverConfig="selectedServer">
    <div class="text-[12px] inline-flex gap-12">
      <span class="inline-flex items-center gap-4 text-(--el-color-primary)"><MdiArrowUpBold/><span class="font-bold">6Mbps</span></span>
      <span class="inline-flex items-center gap-4 text-(--el-color-orange)"><MdiArrowDownBold/><span class="font-bold">10Mbps</span></span>
    </div>
  </ServerConfigItem>
</template>
<style scoped>
.server-configs{
  background: linear-gradient(to right top, var(--release-bg-0), var(--release-bg-1));
}
</style>
