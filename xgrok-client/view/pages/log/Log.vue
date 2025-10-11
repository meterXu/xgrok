<script setup>
import {ref, nextTick, watch} from "vue"
import {useRoute} from 'vue-router'
import HorizontalHeader from "@/components/header/HorizontalHeader.vue";
import PlusScrollbar from "@/components/plus-scrollbar/PlusScrollbar.vue";
import 'highlight.js/styles/atom-one-light.css'
import hljs from 'highlight.js/lib/core';
import accesslog from 'highlight.js/lib/languages/accesslog';

const route = useRoute()
const logContent = ref('')
const endIndex = ref(0)
const logScrollbarRef = ref(null)
const logContentRef = ref()
hljs.registerLanguage('accesslog', accesslog);

function onRefresh(init = false) {
  if (init) {
    endIndex.value = 0
  }
  window.project.variable.mode !== 'browser' && window.electronAPI.getLog({
    startIndex: endIndex.value,
    length: 100
  }).then(res => {
    if (init) {
      logContent.value = res.data.records.map(c=>{
        return hljs.highlight(c, { language: 'accesslog' }).value
      }).join('<br/>')
    } else {
      logContent.value = logContent.value.concat(
          res.data.records.map(c=>{
            return hljs.highlight(c, { language: 'accesslog' }).value
          }).join('<br/>')
      )
    }
    nextTick(() => {
      logScrollbarRef.value.scrollbar.setScrollTop(logContentRef.value.clientHeight);
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
  <div class="w-full h-full flex flex-col">
    <HorizontalHeader :hasLock="false"></HorizontalHeader>
    <div class="flex-1 flex flex-col gap-16 py-32 px-24">
      <div>
        <el-button type="primary" plain @click="onRefresh(false)">
          <template #icon>
            <ep-refresh/>
          </template>
          刷新
        </el-button>
      </div>
      <div class="flex-1 w-full relative text-[16px] overflow-y-auto rounded-4xl
           border-1 border-(--border-color) bg-(--primary-bg-0)">
        <div class="absolute w-full h-full p-12">
          <plus-scrollbar ref="logScrollbarRef">
            <div ref="logContentRef" v-html="logContent"></div>
          </plus-scrollbar>
        </div>
      </div>
    </div>
  </div>
</template>