<script setup>
import {useAppStore} from "@/store";
import {useRouter} from "vue-router";
import avatar from '@/assets/imgs/avatar.svg'
import {confirm} from "@/libs/common";
import {ElMessage} from "element-plus";
import {closeWebSocket} from "@/api";
import {useGoTo} from "@/libs/useAction";
import {showNotification} from "@/libs/message";
import {NotificationType} from "@/libs/enums";
const store = useAppStore()
const {userInfo,pid} = store
const router = useRouter()

function onCommand(command) {
  if(command === 'Logout') {
    logout()
  }else{
    useGoTo(command)
  }
}

function logout() {
  confirm('确定要退出登录吗？', null, {
    confirmButtonClass: 'el-button--danger is-plain',
    beforeClose: async function (action, instance, done) {
      try {
        if (action === 'confirm') {
          instance.confirmButtonLoading = true
          instance.confirmButtonText = '退出中...'
          instance.cancelButtonClass = instance.cancelButtonClass + ' my-btn-disabled'
          if (pid.value) {
            const res = await window.electronAPI.turnOff(pid.value)
            instance.confirmButtonLoading = false
            if (res.success) {
              store.setPid(null)
              store.setConfigIsLock(false)
              store.setAppSetting({autoServer:false})
              done()
            }else{
              showNotification(NotificationType.error,res.message||'退出失败')
            }
          }else{
            done()
            instance.confirmButtonLoading = false
          }
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
    store.setConfigIsLock(false)
    closeWebSocket()
    useGoTo('Login', true)
  })
}
</script>

<template>
  <el-dropdown @command="onCommand">
    <el-avatar :src="avatar" class="bg-transparent! cursor-pointer">
      <span>{{ userInfo?.username }}</span>
    </el-avatar>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="Plan">我的捐赠</el-dropdown-item>
        <el-dropdown-item command="Setting">系统设置</el-dropdown-item>
        <el-dropdown-item command="Logout" class="avatar-exit-system">退出系统</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style lang="less">
.avatar-exit-system {
  color: var(--el-color-danger)!important;
}
</style>
