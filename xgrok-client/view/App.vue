<script setup>
import HeaderToolBar from "@/components/HeaderToolBar.vue";
import {deviceType, getSystemTheme} from "@/libs/common";
import bus from "@/libs/bus";
import {resizeFontSize} from "xxweb-util";
import {useAppStore} from '@/store'

const router = useRouter()
const {appSetting} = useAppStore()

window.onresize = ()=>{
  resizeFontSize(1000,4,0,(width)=>{
    if(width<800){
      return 800
    }
    if(width>1000){
      return 1000
    }
  }).then(widthNum=>{
    bus.$emit('processWidth',widthNum/4)
  })
}
// window.onresize

window.project.variable.mode!=='browser'&&window.electronAPI.onRoute((data)=>{
  router.push({name:data.name})
})

watchEffect(()=>{
  if(appSetting.theme==='system'){
    const theme = getSystemTheme((theme)=>{
      appSetting.theme==='system'&&document.querySelector('html').setAttribute('theme',theme)
      appSetting.theme==='system'&&document.querySelector('html').setAttribute('class',theme)
    })
    document.querySelector('html').setAttribute('theme',theme)
    document.querySelector('html').setAttribute('class',theme)
  }else{
    document.querySelector('html').setAttribute('theme',appSetting.theme)
    document.querySelector('html').setAttribute('class',appSetting.theme)
  }

})
</script>

<template>
  <el-config-provider size="default">
    <div class="main">
      <HeaderToolBar v-if="deviceType()==='win32'"></HeaderToolBar>
      <div class="main-container">
        <router-view v-slot="{ Component }">
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </div>
    </div>
  </el-config-provider>
</template>
