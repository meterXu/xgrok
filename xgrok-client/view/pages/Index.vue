<script setup>
import {useAppStore} from "@/store";
import {useRouter,useRoute,onBeforeRouteUpdate} from 'vue-router'
import {ElMessage, ElMessageBox} from "element-plus";
import {closeWebSocket, queryPayPlan} from "@/api";
import {usePayPlanColor} from '@/libs/common'
const store = useAppStore()
const {userInfo,pid,plan} = store
const router = useRouter()
const route = useRoute()
const btnText = ref(null)
const btnIcon = shallowRef(IIconParkOutlineHandRight)
const btnVisible = ref(true)

queryPayPlan().then(res=>{
  if(res.success){
    store.setPlan(res.data)
    btnText.value=getBtnText(res.data)
  }
})

function logout(){
  ElMessageBox({
    message:'确定要退出登录吗？',
    showCancelButton: true,
    center:true,
    closeOnClickModal:false,
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    customClass:'logout-confirm',
    cancelButtonClass:'el-button--info is-plain my-info-btn no-border',
    confirmButtonClass:'el-button--info is-plain my-info-btn my-info-btn-danger no-border',
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
    router.replace({name:'Login'})
  })
}
onBeforeMount(()=>{
  btnVisible.value = router.currentRoute.value.name==='Plan'||router.currentRoute.value.name==='Dashboard'
})
onBeforeRouteUpdate((to, from, next)=>{
  if(to.name==='Plan'){
    btnText.value='返回'
    btnIcon.value = IEpBack
  }else{
    btnText.value= getBtnText(plan)
    btnIcon.value = IIconParkOutlineHandRight
  }
  btnVisible.value = to.name==='Plan'||to.name==='Dashboard'
  next()
})

function getBtnText(plan){
  return  plan.text
}

function onPlanBtnClick(){
  if(route.name==="Plan"){
    router.replace({name:'Dashboard'})
  }
  if(route.name==="Dashboard"){
    router.replace({name:'Plan'})
  }
}

</script>

<template>
  <div class="common-layout">
    <el-container class="my-container">
      <el-header class="header">
        <div class="header-content-wrap" v-if="userInfo">
          <el-button v-if="btnVisible" :type="usePayPlanColor(plan.value)" plain class="no-border"
                     @click="onPlanBtnClick">
            <template #icon>
              <component :is="btnIcon"></component>
            </template>{{btnText}}
          </el-button>
          <div v-else></div>
          <div>
            {{userInfo.user.username}}
            <el-divider direction="vertical" />
            <el-button type="info" class="my-info-btn my-info-btn-danger no-border" plain @click="logout">退出登录</el-button>
          </div>
        </div>
      </el-header>
      <el-main class="content-wrap">
        <router-view></router-view>
      </el-main>
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
<style lang="less">
.logout-confirm{
  width: 240px;
  padding: 16px;
  .el-message-box__btns{
    padding-top: 24px;
  }
}
</style>