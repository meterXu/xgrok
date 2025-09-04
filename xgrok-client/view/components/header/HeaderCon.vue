<script setup>
import Logo from "../Logo.vue";
import {useRouter} from "vue-router";
import {useAppStore} from "@/store";
import {confirm, usePayPlanColor} from '@/libs/common'
import {useGoBack,useGoTo} from "@/libs/useAction";
import {ElMessage} from "element-plus";
import {closeWebSocket} from "@/api";

const router = useRouter()
const store = useAppStore()
const {userInfo, plan, headerBtnLoading} = store
const showBackBtn = computed(() => {
  return router.currentRoute.value.name === 'Plan' || router.currentRoute.value.name === 'Setting'
})

function onSettingClick() {
  useGoTo('Setting')
}

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
    useGoTo('Login', true)
  })
}

</script>

<template>
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
              <icon-park-outline-handRight/>
            </template>
            {{ plan.text }}
          </el-button>
        </template>
        <template v-if="showBackBtn">
          <el-divider direction="vertical"/>
          <el-button plain :type="usePayPlanColor(plan.value)"
                     :disabled="headerBtnLoading"
                     :loading="headerBtnLoading"
                     class="text-[14px]! py-14!"
                     size="small" @click="useGoBack">
            <template #icon>
              <ep-back></ep-back>
            </template>
            返回
          </el-button>
        </template>
      </div>
      <div class="flex justify-start items-center">
        <span>{{ userInfo.user.username }}</span>
        <icon-park-outline-setting-two @click="onSettingClick"
                                         class="ml-8 cursor-pointer hover:text-(--el-color-primary)"></icon-park-outline-setting-two>
        <el-divider direction="vertical"/>
        <el-button class="text-[14px]! py-14!" size="small" type="danger" plain @click="logout">
          <template #icon>
            <icon-park-outline-logout/>
          </template>
          退出登录
        </el-button>
      </div>
    </div>
  </el-header>
</template>

<style scoped lang="less">
.header {
  padding: 0;
  height: unset;
  border-bottom: 1px solid var(--el-border-color);

  .header-content-wrap {
    font-size: 14px;
    height: 56px;
    padding: 0 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
