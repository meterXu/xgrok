<script setup>
import LinkButton from "@/components/LinkButton.vue";
import {Loading} from '@element-plus/icons-vue'
import {useAppStore} from "@/store";
import {storeToRefs} from 'pinia'
import {onOpenLink, useClientTypeExecute} from "@/libs/useAction";
import {versionLatest} from "@/api";
import {clientType} from "@/libs/enums";
import {confirm,alert} from '@/libs/common'

const store = useAppStore()
const {checkUpdateLoading} = storeToRefs(useAppStore())
function onCheckUpdate() {
  store.setCheckUpdateLoading(true)
  useClientTypeExecute(()=>{
    return versionLatest()
  },()=>{
    return window.electronAPI.checkUpdate()
  }).then(res=>{
    if(res.data&&window.project.variable.mode===clientType.browser){
      confirm('发现新版本，去官网更新！',undefined,{
        confirmButtonText: '去更新',
        cancelButtonText: '取消',
      }).then(({done})=>{
        done()
        onOpenLink('https://www.xdo.icu')
      }).catch(()=>{})
    }
  }).catch(()=>{
    alert('无可用更新，当前已是最新版本！')
  }).finally(()=>{
    store.setCheckUpdateLoading(false)
  })
}
</script>

<template>
  <div class="flex flex-row gap-24">
    <LinkButton :hasArrow="false" v-debounce:click="onCheckUpdate">
      <template #icon>
        <el-icon v-if="checkUpdateLoading" class="is-loading mr-5">
          <Loading/>
        </el-icon>
        <MdiUpdate  v-else />
      </template>
      检查更新
    </LinkButton>
    <LinkButton :hasArrow="true" href="https://www.xdo.icu">
      <template #icon>
        <MdiWeb></MdiWeb>
      </template>
      官方网站
    </LinkButton>
    <LinkButton :hasArrow="true" href="https://github.com/meterXu/xgrok/issues">
      <template #icon>
        <MdiGithub/>
      </template>
      建议反馈
    </LinkButton>
  </div>
</template>

<style scoped lang="less">

</style>
