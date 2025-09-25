<script setup>
import HorizontalHeader from "@/components/header/HorizontalHeader.vue";
import PlusScrollbar from "@/components/plus-scrollbar/PlusScrollbar.vue";
import {watch} from 'vue'
import {useAppStore} from "@/store";

const store = useAppStore()
const {appSetting} = store

watch(appSetting, (nv) => {
  store.setAppSetting(nv)
})
</script>

<template>
  <div class="h-full flex flex-col setting-wrap">
    <HorizontalHeader :hasLock="false"></HorizontalHeader>
    <el-form class="flex-1 relative" :model="appSetting" label-width="auto" label-position="left" @submit.prevent>
      <plus-scrollbar>
        <div class="my-32 mx-24">
          <div class="px-14">基础</div>
          <div class="rounded-3xl bg-(--primary-bg-0) px-12 py-16 mt-14">
            <el-form-item label="开启启动" class="justify-between">
              <el-checkbox v-model="appSetting.startAuto"/>
            </el-form-item>
            <el-form-item label="后台运行" class="justify-between mb-0!">
              <el-checkbox v-model="appSetting.exitInTaskBar"/>
            </el-form-item>
          </div>
          <div class="px-14 mt-16">外观</div>
          <div class="rounded-3xl bg-(--primary-bg-0) px-12 py-16 mt-14">
            <el-form-item label="界面主题" class="justify-between mb-0!">
              <el-radio-group v-model="appSetting.theme" size="small">
                <el-radio-button label="亮色" value="light"/>
                <el-radio-button label="暗黑" value="dark"/>
                <el-radio-button label="跟随系统" value="system"/>
              </el-radio-group>
            </el-form-item>
          </div>
        </div>
      </plus-scrollbar>
    </el-form>
  </div>
</template>

<style lang="less">
.setting-wrap {
  .el-form-item__content {
    display: inline-flex;
    flex: none;
  }
}
</style>
