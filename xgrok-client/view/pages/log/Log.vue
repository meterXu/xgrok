<script setup>
import {useGoBack} from "@/libs/useAction";
import {onBeforeMount,ref} from "vue"

const logContent = ref('')
const endIndex = ref(0)
function onRefresh(override=false){
  window.electronAPI.getLog({startIndex:endIndex.value,length:500}).then(res=>{
    if(override){
      logContent.value = res.data.records.join('<br/>')
    }else{
      logContent.value = logContent.value.concat(res.data.records.join('<br/>'))
    }
    endIndex.value = res.data.endIndex+1
  })
}

onBeforeMount(()=>{
  onRefresh(true)
})
</script>

<template>
  <div class="flex w-full h-full flex-col gap-12 p-12">
    <div>
      <el-button type="success" plain class="text-[14px]! py-14!" size="small" @click="useGoBack">
        <template #icon>
          <i-ep-back/>
        </template>
        返回</el-button>
      <el-button type="danger" plain class="text-[14px]! py-14!" size="small" @click="onRefresh(false)">
        <template #icon>
          <i-ep-refresh/>
        </template>
        刷新</el-button>
    </div>
    <div class="flex-1 w-full relative text-[14px] overflow-y-auto rounded-2xl p-12 bg-gray-800 text-(--el-color-primary)" v-html="logContent">
    </div>
  </div>
</template>

<style scoped lang="less">

</style>
