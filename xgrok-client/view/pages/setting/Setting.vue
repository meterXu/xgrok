<script setup>
import Logo from '@/components/left-aside/Logo.vue'
import {nextTick} from 'vue'

const showProxyInput = ref(false)
const proxyInput = ref()
const form = reactive({
  theme:'system',
  startAuto:true,
  exitInTaskBar:true,
  proxy:''
})
function onChangeProxyInput(){
  showProxyInput.value=!showProxyInput.value
  showProxyInput.value&&nextTick(() => {
    proxyInput.value.focus()
  })
}
function onProxyChange(){
  showProxyInput.value=false
}
</script>

<template>
  <div class="flex flex-col justify-start items-center px-20">
    <div class="text-center">
      <Logo size="large" class="inline-block -mb-32"/>
      <div class="flex flex-col gap-8">
        <div class="text-[16px] font-bold">Xgrok(v1.0.4)</div>
        <div class="text-[14px]">您的应用代理访问工具</div>
        <div>
          <el-button type="success" plain size="">检查更新</el-button>
          <el-button type="success" plain size="">首页</el-button>
          <el-button type="success" plain size="">建议反馈</el-button>
          <el-button type="success" plain size="">邮件联系</el-button>
        </div>
      </div>
    </div>
    <div class="text-[14px] mt-12 mb-36">qq群 1035160464</div>
    <el-form :model="form" label-width="auto" class="w-360" @submit.prevent>
      <el-form-item label="界面主题">
        <el-radio-group v-model="form.theme" size="small">
          <el-radio-button label="亮色" value="light" />
          <el-radio-button label="暗黑" value="dark" />
          <el-radio-button label="跟随系统" value="system" />
        </el-radio-group>
      </el-form-item>
      <el-form-item label="开启启动">
        <el-checkbox v-model="form.startAuto"/>
      </el-form-item>
      <el-form-item label="退出状态">
        <el-checkbox v-model="form.exitInTaskBar"/>
      </el-form-item>
      <el-form-item label="代理配置">
        <div class="flex flex-row items-center justify-start gap-4">
          <el-input ref="proxyInput" v-if="showProxyInput" v-model="form.proxy" size="small" @change="onProxyChange"/>
          <el-link v-else size="small" type="success">{{form.proxy}}</el-link>
          <el-button class="p-0!" size="small" type="text" @click="onChangeProxyInput">{{showProxyInput?'完成':'设置'}}</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped lang="less">

</style>
