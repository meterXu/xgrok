<script setup>
import {useAppStore} from "@/store";
import {useRouter} from 'vue-router'
import {ElMessage} from "element-plus";
import {closeWebSocket} from "@/api";
import {confirm, usePayPlanColor} from '@/libs/common'
import {useGoBack, useGoTo} from "@/libs/useAction";
import Logo from '@/components/left-aside/Logo.vue'

const store = useAppStore()
const {userInfo, pid, plan,headerBtnLoading} = store
const router = useRouter()

const showBackBtn=computed(() => {
  return router.currentRoute.value.name==='Plan'||router.currentRoute.value.name==='Setting'
})

function logout() {
  confirm('确定要退出登录吗？', null, {
    confirmButtonClass: 'el-button--danger is-plain ',
    beforeClose: async function (action, instance, done) {
      try {
        if (action === 'confirm') {
          instance.confirmButtonLoading = true
          instance.confirmButtonText = '退出中...'
          instance.cancelButtonClass = instance.cancelButtonClass + ' my-btn-disabled'
          if (pid.value) {
            await window.electronAPI.turnOff(pid.value)
            store.setPid(null)
          }
          done()
          instance.confirmButtonLoading = false
        } else {
          done()
        }
      } catch (err) {
        instance.cancelButtonClass = instance.cancelButtonClass.replace(' my-btn-disabled', '')
        instance.confirmButtonText = '确定'
        instance.confirmButtonLoading = false
        ElMessage.error(err.message)
      }
    },
  }).then(() => {
    store.setToken(null)
    store.setUserInfo(null)
    store.setSelectedServer(null)
    store.setConfigIsLock(false)
    closeWebSocket()
    useGoTo('Login',true)
  })
}

function onSettingClick(){
  useGoTo('Setting')
}

onMounted(()=>{
  console.log(plan)
})

</script>

<template>
  <div class="common-layout">
    <el-container class="my-container flex flex-row justify-start items-start">
      <el-aside class="w-40 bg-gray-800 h-full">
        xxx
      </el-aside>
      <el-container>
        <el-header class="header">
          <div class="header-content-wrap" v-if="userInfo">
            <div class="flex justify-start items-center">
              <Logo title="xgrok"/>
              <template v-if="router.currentRoute.value.name==='Dashboard'">
                <el-divider direction="vertical"/>
                <el-button :disabled="!plan.text||headerBtnLoading" :type="usePayPlanColor(plan.value)" plain
                           :loading="headerBtnLoading"
                           class="text-[14px]! py-14!"
                           size="small"
                           @click="useGoTo('Plan')">
                  <template #icon>
                    <i-icon-park-outline-handRight/>
                  </template>
                  {{ plan.text }}
                </el-button>
              </template>
              <template v-if="showBackBtn">
                <el-divider direction="vertical" />
                <el-button plain :type="usePayPlanColor(plan.value)"
                           :disabled="headerBtnLoading"
                           :loading="headerBtnLoading"
                           class="text-[14px]! py-14!"
                           size="small" @click="useGoBack">
                  <template #icon>
                    <i-ep-back></i-ep-back>
                  </template>
                  返回
                </el-button>
              </template>
            </div>
            <div class="flex justify-start items-center">
              <span>{{ userInfo.user.username }}</span>
              <i-icon-park-outline-setting-two @click="onSettingClick" class="ml-8 cursor-pointer hover:text-(--el-color-primary)"></i-icon-park-outline-setting-two>
              <el-divider direction="vertical"/>
              <el-button class="text-[14px]! py-14!" size="small" type="danger" plain @click="logout">
                <template #icon>
                  <i-icon-park-outline-logout/>
                </template>
                退出登录
              </el-button>
            </div>
          </div>
        </el-header>
        <el-main class="content-wrap">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style lang="less" scoped>
.common-layout {
  height: 100%;
}

.my-container {
  height: 100%;
}

.header {
  padding: 0;
  height: unset;
  border-bottom: 1px solid var(--el-border-color);
}

.header-content-wrap {
  font-size: 14px;
  height: 56px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.content-wrap {
  padding: 0;
  position: relative;
}
</style>
