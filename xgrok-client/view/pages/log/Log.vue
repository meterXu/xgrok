<script setup>
import {useGoBack} from "@/libs/useAction";
import {onMounted, ref, nextTick, watch} from "vue"
import {useRoute} from 'vue-router'

const route = useRoute()
const logContent = ref('')
const endIndex = ref(0)
const logContentRef = ref(null)

function onRefresh(init = false) {
  if(init){
    endIndex.value=0
  }
  window.electronAPI.getLog({startIndex: endIndex.value, length: 100}).then(res => {
    if (init) {
      logContent.value = res.data.records.join('<br/>')
    } else {
      logContent.value = logContent.value.concat(res.data.records.join('<br/>'))
    }
    nextTick(() => {
      logContentRef.value.scrollTop = logContentRef.value.scrollHeight;
    })
    endIndex.value = res.data.endIndex + 1
  })
}

watch(route, (nv) => {
      if (nv.name === 'Log') {
        onRefresh(true)
      }
    },
    {immediate: true});
</script>

<template>
  <div class="flex w-full h-full flex-col gap-12 p-12">
    <div>
      <el-button type="success" plain class="text-[14px]! py-14!" size="small" @click="useGoBack">
        <template #icon>
          <ep-back/>
        </template>
        返回
      </el-button>
      <el-button type="default" plain class="text-[14px]! py-14!" size="small" @click="onRefresh(false)">
        <template #icon>
          <ep-refresh/>
        </template>
        刷新
      </el-button>
    </div>
    <div ref="logContentRef"
         class="flex-1 w-full relative text-[14px] overflow-y-auto rounded-2xl p-12 border-1 border-(--el-border-color) bg-(--server-info-bg) text-(--el-color-primary) smooth"
         v-html="logContent">
    </div>
  </div>
</template>

<style scoped lang="less">
.smooth {
  scroll-behavior: smooth;
}
</style>
