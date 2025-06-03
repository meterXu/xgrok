<script setup lang="ts">
import {reactive, computed, ref, shallowReactive, onMounted} from 'vue';
import {useRouter} from 'vue-router'
import {login} from '@/api';
import {appStore} from '@/store/index.js'
import {showNotification} from '@/libs/utils'
import {NotificationTypeEnum} from "@/libs/enum";

const router = useRouter()
const ruleFormRef = ref(null)
const form = shallowReactive({username: null, password: null,remember:false})

function onSubmit() {
  if((ruleFormRef.value as any).checkValidity()){
    login(form).then(res => {
      if (res.success) {
        if(form.remember){
          window.$ls.set('remember',btoa(JSON.stringify(form)))
        }else{
          window.$ls.remove('remember')
        }
        appStore().setUserInfo(res.data)
        appStore().setToken("Bearer " + res.data.accessToken)
        router.push({
          name: 'Index'
        })
      } else {
        showNotification(NotificationTypeEnum.error, res.message||'登录失败')
      }
    })
  }
}
onMounted(()=>{
  if(window.$ls.get('remember')){
    Object.assign(form,JSON.parse(atob(window.$ls.get('remember'))))
  }
})
</script>

<template>
  <div class="p-12 px-20 h-full flex justify-center items-center overflow-hidden divide-y bg-slate-100 dark:bg-zinc-900">
    <div class="w-350">
      <div class="w-full h-52 rounded-t-2xl bg-[#304156] dark:bg-zinc-800">
        <img class="mx-auto h-full w-auto" src="../assets/img/icon2.webp" alt="xgrok" />
      </div>
      <div class="w-full p-28 rounded-b-2xl space-y-12 bg-white text-neutral-600 dark:bg-zinc-950 dark:text-gray-100">
        <h1 class="text-[20px] font-bold text-center">登录你的账号</h1>
        <form ref="ruleFormRef" class="space-y-21 ng-untouched ng-pristine ng-valid">
          <div class="mb-20">
            <label for="username" class="block text-[14px] text-gray-500 dark:text-gray-400">邮箱</label>
            <input type="text" v-model="form.username" placeholder="" required
                   class="w-full px-14 py-5.25 rounded-2xl text-[14px]/[21px] border-1 outline-none
                   border-gray-200 focus:border-(--el-color-primary)
                   dark:border-zinc-700 dark:bg-zinc-900 dark:text-gray-100 dark:focus:border-ring-blue-500">
          </div>
          <div class="mb-20">
            <label for="password" class="block text-[14px] text-gray-500 dark:text-gray-400">密码</label>
            <input type="password" v-model="form.password"  placeholder="" autocomplete="" required
                   class="w-full px-14 py-5.25 rounded-2xl text-[14px]/[21px] border-1 outline-none
                   border-gray-200 focus:border-(--el-color-primary)
                   dark:border-zinc-700 dark:bg-zinc-900 dark:text-gray-100 dark:focus:border-ring-blue-500">
          </div>
          <div class="mb-20 flex justify-start gap-2">
            <input type="checkbox" v-model="form.remember" class="bg-gray-100 border-gray-200" id="remember">
            <label for="remember" class="text-[14px]">记住我</label>
          </div>
          <button class="block w-full p-10.5 text-center text-white rounded-2xl bg-(--el-color-primary) cursor-pointer text-[14px]"
                  type="button" @click="onSubmit">登 录</button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
