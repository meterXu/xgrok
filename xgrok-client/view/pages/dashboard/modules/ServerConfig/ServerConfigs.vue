<script setup>
import ServerConfigItem from "@/components/ServerConfigItem.vue";
import {useAppStore} from "@/store";
import {speedAndTraffic} from "@/api";

const emits = defineEmits(['change'])
const props = defineProps(['tunnelCount'])
const store = useAppStore()
const {selectedServer,clientId} = store
let timer = 0
const speed = ref('0')
const traffic = ref('0')

function timeOutFun(){
  timer = setTimeout(async () => {
    const speedAndTrafficRes = await speedAndTraffic(selectedServer.id,clientId.value)
    speed.value = speedAndTrafficRes.data.speed
    traffic.value = speedAndTrafficRes.data.traffic
    timeOutFun()
  },1000)
}

onMounted(() => {
  timeOutFun()
})

onUnmounted(() => {
  timer&&clearInterval(timer)
})

</script>

<template>
  <ServerConfigItem class="server-configs border-none bg-(--primary-bg-0) h-full" :serverConfig="selectedServer">
    <div class="text-[12px] inline-flex gap-12">
      <span class="inline-flex items-center gap-4 text-(--el-color-primary)"><MdiArrowUpBold/><span class="font-bold">{{speed}}</span></span>
      <span class="inline-flex items-center gap-4 text-(--el-color-orange)"><MdiStorage/><span class="font-bold">{{traffic}}</span></span>
    </div>
  </ServerConfigItem>
</template>
<style scoped>
.server-configs{
  background: linear-gradient(to right top, var(--release-bg-0), var(--release-bg-1));
}
</style>
