<script setup>
import HorizontalHeader from "@/components/header/HorizontalHeader.vue";
import PlusScrollbar from "@/components/plus-scrollbar/PlusScrollbar.vue";
import {useAppStore} from "@/store";
import {useClientType} from "@/libs/useAction";
import {clientType} from '@/libs/enums'

let {appSetting,setAppSetting} = useAppStore()
const clientTypeRef = useClientType()
function onChange(type,value){
  let data = {}
  data[type] = value;
  setAppSetting(data)
}

</script>

<template>
  <div class="h-full flex flex-col setting-wrap">
    <HorizontalHeader :hasLock="false"></HorizontalHeader>
    <el-form class="flex-1 relative" label-width="auto" label-position="left" @submit.prevent>
      <plus-scrollbar>
        <div class="my-32 mx-24">
          <template v-if="clientTypeRef===clientType.electron">
            <div class="px-14">基础</div>
            <div class="rounded-3xl bg-(--primary-bg-0) px-12 py-16 mt-14">
              <el-form-item label="开启启动" class="justify-between">
                <el-checkbox v-model="appSetting.autoLaunch" @change="(value)=>{onChange('autoLaunch',value)}"/>
              </el-form-item>
              <el-form-item label="后台运行" class="justify-between mb-0!">
                <el-checkbox v-model="appSetting.exitInTaskBar" @change="(value)=>{onChange('exitInTaskBar',value)}"/>
              </el-form-item>
            </div>
          </template>
          <div class="px-14 mt-16">外观</div>
          <div class="rounded-3xl bg-(--primary-bg-0) px-12 py-16 mt-14">
            <el-form-item label="界面主题" class="justify-between mb-0!">
              <el-radio-group v-model="appSetting.theme" @change="(value)=>{onChange('theme',value)}">
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
