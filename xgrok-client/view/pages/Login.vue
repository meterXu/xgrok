<script setup>
import {useRouter} from 'vue-router'
import {reactive, ref} from "vue";
import {login} from "@/api";
import {ElMessage} from "element-plus";
import {useAppStore} from "@/store";
import {
  onFormValidate,
  useGetDisabled,
  useGetValidateRes,
  useGetTermsOfServiceUrl, usePrivacyAgreementUrl
} from "@/libs/useAction";

const store = useAppStore()
const {userName} = store
const router = useRouter()
const ruleForm = ref('ruleForm')
const form = reactive({
  username:userName.value,
  password:null,
  isReadArticle:null
})
const rules = {
  username:[{ required: true, message: '账号名/邮箱必填', trigger: 'change' }],
  password:[{ required: true, message: '密码必填', trigger: 'change' }],
  isReadArticle:[
      {validator:(rule,value,callback)=>{
          value?callback():callback('请阅读"服务条款"和隐私策略"')
      }, trigger: 'change'}
  ]
}
const loginLoading = ref(false)
const validateRes = useGetValidateRes(form)
const submitDisable = useGetDisabled(validateRes)

function onSubmit(){
  ruleForm.value.validate(valid=>{
    if(valid){
      loginLoading.value=true
      login(form).then(res=>{
        if(res.success){
          store.setUserName(form.username)
          store.setUserInfo(res.data)
          store.setToken(res.data.accessToken)
          router.push({
            name:'Dashboard'
          })
        }else{
          ElMessage.error(res.message)
        }
      }).finally(()=>{
        loginLoading.value = false
      })
    }
  })
}

function onOpenLink(link){
  window.electronAPI.openExternal(link)
}

</script>

<template>
  <div class="center-container login-register-form">
    <div class="form-wrap">
      <div class="main">
        <h1 class="title">
          <img src="../../public/assets/icon.png" alt="logo" class="logo"/>
          <span class="text-[28px] font-bold">xgrok</span>
        </h1>
        <el-form :model="form" ref="ruleForm" label-position="top" label-width="auto"
                 :hide-required-asterisk="true"
                 :show-message="false"
                 :rules="rules"
                 @validate="(prop,valid,value)=>{onFormValidate(validateRes,{prop,valid,value})}">
          <el-form-item label="账号" prop="username">
            <el-input size="default" v-model="form.username" placeholder="账号名/邮箱"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input size="default" type="password" v-model="form.password" @keydown.enter="onSubmit"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button size="default" class="btn" type="success" :loading="loginLoading" :disabled="submitDisable"  @click="onSubmit">登录</el-button>
          </el-form-item>
          <el-form-item prop="isReadArticle">
            <el-checkbox v-model="form.isReadArticle">我已经阅读并同意
              <a class="link" href="javascript:;" @click="onOpenLink(useGetTermsOfServiceUrl())">服务条款</a> 和
              <a class="link" href="javascript:;" @click="onOpenLink(usePrivacyAgreementUrl())">隐私协议</a>
            </el-checkbox>
          </el-form-item>
        </el-form>
      </div>
      <div class="footer">
        <router-link :to="{name:'Register'}">注册</router-link>
        <el-divider direction="vertical"/>
        <router-link :to="{name:'ForgotPassword'}">忘记密码</router-link>
      </div>
    </div>
  </div>
</template>

<style lang="less">
.login-register-form{
  .el-form-item.is-error .el-input__wrapper{
    box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color)) inset;;
  }
  .link{
    text-decoration: none;
    color: var(--el-color-success);
  }
}
</style>