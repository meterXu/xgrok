<script setup>
import {useAppStore} from "@/store";
import {useRouter} from 'vue-router'
import {ElMessage} from "element-plus";
import {closeWebSocket, queryPayPlan} from "@/api";
import {confirm, usePayPlanColor} from '@/libs/common'
import {useGoBack, useGoTo} from "@/libs/useAction";
import Logo from '@/components/left-aside/Logo.vue'
const store = useAppStore()
const {userInfo,pid,plan} = store
const router = useRouter()
const btnText = ref(null)

function logout(){
  confirm('确定要退出登录吗？',null,{
    confirmButtonClass:'el-button--danger is-plain ',
    beforeClose:async function(action, instance, done){
      try{
        if (action === 'confirm') {
          instance.confirmButtonLoading = true
          instance.confirmButtonText = '退出中...'
          instance.cancelButtonClass = instance.cancelButtonClass+' my-btn-disabled'
          if(pid.value){
            await window.electronAPI.turnOff(pid.value)
            store.setPid(null)
          }
          done()
          instance.confirmButtonLoading = false
        } else {
          done()
        }
      }catch (err){
        instance.cancelButtonClass = instance.cancelButtonClass.replace(' my-btn-disabled','')
        instance.confirmButtonText = '确定'
        instance.confirmButtonLoading = false
        ElMessage.error(err.message)
      }
    },
  }).then(()=>{
    store.setToken(null)
    store.setUserInfo(null)
    store.setSelectedServer(null)
    closeWebSocket()
    useGoTo('Login')
  })
}

function getBtnText(plan){
  return  plan.text
}

queryPayPlan().then(res=>{
  res.success && store.setPlan(res.data)
  btnText.value = getBtnText(res.data)
})

</script>

<template>
  <div class="common-layout">
    <el-container class="my-container">
      <el-container>
        <el-header class="header">
          <div class="header-content-wrap" v-if="userInfo">
            <div class="flex justify-start items-center">
              <Logo title="xgrok"/>
              <el-divider direction="vertical" />
              <el-button :disabled="!btnText" :type="usePayPlanColor(plan.value)" plain v-if="router.currentRoute.value.name==='Dashboard'"
                         class="text-[14px]! py-14!"
                         size="small"
                         @click="useGoTo('Plan')">
                <template #icon>
                  <i-icon-park-outline-handRight/>
                </template>
                {{btnText}}
              </el-button>
              <el-button plain :type="usePayPlanColor(plan.value)" v-if="router.currentRoute.value.name==='Plan'"
                         class="text-[14px]! py-14!"
                         size="small" @click="useGoBack">
                <template #icon>
                  <i-ep-back></i-ep-back>
                </template>
                返回
              </el-button>
            </div>
            <div>
              {{userInfo.user.username}}
              <el-divider direction="vertical" />
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
.common-layout{
  height: 100%;
}
.my-container{
  height: 100%;
}
.header{
  padding: 0;
  height: unset;
  border-bottom: 1px solid var(--el-border-color);
}
.header-content-wrap{
  font-size: 14px;
  height: 56px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.content-wrap{
  padding: 0;
  position: relative;
}
</style>
