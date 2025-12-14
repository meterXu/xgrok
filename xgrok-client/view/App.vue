<script setup>
import HeaderToolBar from "@/components/HeaderToolBar.vue";
import {deviceType, getTheme, systemThemeChangeEvent} from "@/libs/common";
import bus from "@/libs/bus";
import {resizeFontSize} from "xxweb-util";
import {useAppStore} from '@/store'
import {useClientTypeExecute} from "@/libs/useAction";

const router = useRouter()
const {setSystemTheme} = useAppStore()

window.onresize = () => {
  resizeFontSize(1000, 4, 0, (width) => {
    if (width < 800) {
      return 800
    }
    if (width > 1000) {
      return 1000
    }
  }).then(widthNum => {
    bus.$emit('processWidth', widthNum / 4)
  })
}

// window.onresize
useClientTypeExecute(() => {
}, () => {
  window.electronAPI.onRoute((data) => {
    router.push({name: data.name})
  })
})

watchEffect(() => {
  document.querySelector('html').setAttribute('theme', getTheme())
  document.querySelector('html').setAttribute('class', getTheme())
})

systemThemeChangeEvent((_theme) => {
  setSystemTheme(_theme)
})
</script>

<template>
  <el-config-provider size="default">
    <div class="main">
      <HeaderToolBar v-if="deviceType()==='win32'"></HeaderToolBar>
      <div class="main-container">
        <router-view v-slot="{ Component }">
          <keep-alive>
            <component :is="Component"/>
          </keep-alive>
        </router-view>
      </div>
    </div>
  </el-config-provider>
</template>
