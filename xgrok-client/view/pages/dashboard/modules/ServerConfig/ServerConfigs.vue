<script setup>
import ServerConfigItem from "@/components/ServerConfigItem.vue";
import {useAppStore} from "@/store";
import {speedAndTraffic} from "@/api";

const emits = defineEmits(['change'])
const props = defineProps(['tunnelCount'])
const store = useAppStore()
const {selectedServer, clientId,pid,token} = store
let timer = 0
const speed = ref('0')
const traffic = ref('0')

async function getSpeedAndTraffic(){
  try{
    if(!token.value) return
    const speedAndTrafficRes = await speedAndTraffic(selectedServer.id, clientId.value)
    speed.value = speedAndTrafficRes.data.speed
    traffic.value = speedAndTrafficRes.data.traffic
  }catch (err){}
}

function startTimeOut() {
  if(pid.value&&timer!==-1){
    timer = setTimeout(async () => {
      await getSpeedAndTraffic()
      startTimeOut()
    }, 1000)
  }
}

function stopTimeOut() {
  timer && clearTimeout(timer)
  timer = -1
}

watch([selectedServer,pid],(nvs)=>{
  if(nvs[0]?.id){
    getSpeedAndTraffic()
  }
  if(nvs[1]){
    startTimeOut()
  }
},{immediate: true})

onUnmounted(() => {
  stopTimeOut()
})

</script>

<template>
  <ServerConfigItem class="server-configs border-none bg-(--primary-bg-0) h-full" :serverConfig="selectedServer">
    <div class="text-[12px] inline-flex gap-12">
      <span class="inline-flex items-center gap-4 text-(--el-color-primary)">
        <MdiArrowUpBold/>
        <el-tooltip effect="dark" :content="speed">
          <span class="font-bold inline-block max-w-80 truncate">{{ speed }}</span>
        </el-tooltip>
      </span>
      <span class="inline-flex items-center gap-4 text-(--el-color-orange)">
        <MdiStorage/>
        <el-tooltip effect="dark" :content="traffic">
          <span class="font-bold inline-block max-w-80 truncate">{{ traffic }}</span>
        </el-tooltip>
      </span>
    </div>
  </ServerConfigItem>
</template>
<style scoped>
.server-configs {
  background: linear-gradient(to right top, var(--release-bg-0), var(--release-bg-1));
}
</style>
