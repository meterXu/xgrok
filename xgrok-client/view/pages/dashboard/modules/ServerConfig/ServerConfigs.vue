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
    <div class="text-[12px] inline-flex gap-8">
      <span class="inline-block">网页:{{tunnelCount.web.length}}</span>
      <span class="inline-block">服务:{{tunnelCount.service.length}}</span>
    </div>
  </ServerConfigItem>
</template>
<style scoped>
.server-configs{
  background: linear-gradient(to right top, var(--release-bg-0), var(--release-bg-1));
}
</style>
