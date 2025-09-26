<script setup>
import {versionList} from '@/api'
import {shallowReactive, onMounted} from 'vue'
import Markdown from 'markdown-it'
import dayjs from 'dayjs'
import PlusLoading from "@/components/plus-loading/PlusLoading.vue";
import PlusScrollbar from "@/components/plus-scrollbar/PlusScrollbar.vue";

const versions = shallowReactive([])
const md = new Markdown()

versionList().then(res => {
  versions.splice(0, versions.length, ...res.map(c => {
    return {
      tag_name: c.tag_name,
      created_at: c.created_at,
      body: md.render(c.body)
    }
  }))
})
</script>

<template>
  <div class="release flex-1 flex flex-col p-16 rounded-4xl gap-32">
    <div class="text-center text-[24px] font-bold">更新日志</div>
    <div class="flex-1 flex flex-col justify-center">
      <plus-loading :loading="versions.length===0" size="7rem" mask-bg-color="transparent" class="flex flex-col gap-32">
        <plus-scrollbar>
          <div v-for="item in versions" :key="item.id">
            <div class="text-[18px] font-bold">{{ item.tag_name }} - {{ dayjs(item.created_at).format('YYYY.MM.DD') }}</div>
            <div class="text-[14px]/[28px] mt-12" v-html="item.body">
            </div>
          </div>
        </plus-scrollbar>
      </plus-loading>
    </div>
  </div>
</template>

<style scoped lang="less">
.release {
  background: linear-gradient(to left bottom, var(--release-bg-0), var(--release-bg-1));
}
</style>
