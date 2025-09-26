<script setup>
import ServerConfigItem from "@/components/ServerConfigItem.vue";
import {useAppStore} from "@/store";

const emits = defineEmits(['change'])
const store = useAppStore()
const {selectedServer} = store

</script>

<template>
  <ServerConfigItem class="server-configs border-none bg-(--primary-bg-0) h-full" :serverConfig="selectedServer" :statusClass="selectedServer.statusClass">
  </ServerConfigItem>
</template>
<style scoped>
.server-configs{
  background: linear-gradient(to right top, var(--release-bg-0), var(--release-bg-1));
}
</style>
