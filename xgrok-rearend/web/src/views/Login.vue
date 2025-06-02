<script setup lang="ts">
import {reactive, computed, ref, shallowReactive} from 'vue';
import {useRouter} from 'vue-router'
import {login} from '@/api';
import {appStore} from '@/store/index.js'
import {showNotification} from '@/libs/utils'
import {NotificationTypeEnum} from "@/libs/enum";

const router = useRouter()
const ruleFormRef = ref(null)
const form = shallowReactive({username: null, password: null})

function onSubmit() {
  if((ruleFormRef.value as any).checkValidity()){
    login(form).then(res => {
      if (res.success) {
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
</script>

<template>
  <div class="p-12 px-20 h-full flex justify-center items-center overflow-hidden divide-y bg-slate-100 dark:bg-zinc-900">
    <div class="w-350">
      <div class="w-full h-60 rounded-t-2xl bg-[#304156] dark:bg-zinc-800">
        <img class="mx-auto h-full w-auto" src="../assets/img/icon2.png" alt="xgrok" />
      </div>
      <div class="w-full p-28 rounded-b-2xl space-y-12 bg-white text-neutral-600 dark:bg-zinc-950 dark:text-gray-100">
        <h1 class="text-[20px] font-bold text-center">登录你的账号</h1>
        <form ref="ruleFormRef" class="space-y-21 ng-untouched ng-pristine ng-valid">
          <div class="mb-20">
            <label for="username" class="block text-[14px] text-gray-500 dark:text-gray-400">邮箱</label>
            <input type="text" v-model="form.username" placeholder="" required
                   class="w-full px-14 py-5.25 rounded-2xl text-[14px]/[21px] border-1 focus:outline-none focus-visible:ring-1
                   border-gray-200 focus-visible:ring-(--el-color-primary)
                   dark:inset-shadow-none
                   dark:border-zinc-700 dark:bg-zinc-900 dark:text-gray-100 dark:focus-visible:ring-blue-500">
          </div>
          <div class="mb-20">
            <label for="password" class="block text-[14px] text-gray-500 dark:text-gray-400">密码</label>
            <input type="password" v-model="form.password"  placeholder="" autocomplete="" required
                   class="w-full px-14 py-5.25 rounded-2xl text-[14px]/[21px] border-1 focus:outline-none focus-visible:ring-1
                   border-gray-200 focus-visible:ring-(--el-color-primary)
                   dark:inset-shadow-none
                   dark:border-zinc-700 dark:bg-zinc-900 dark:text-gray-100 dark:focus-visible:ring-blue-500">
          </div>
          <button class="mt-40 block w-full p-10.5 text-center text-white rounded-2xl bg-(--el-color-primary) dark:bg-blue-500 cursor-pointer text-[14px]"
                  type="button" @click="onSubmit">登 录</button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
