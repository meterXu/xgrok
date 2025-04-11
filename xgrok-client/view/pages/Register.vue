<script setup>
import {reactive, ref} from 'vue'
import {ElMessage} from 'element-plus'
import {checkUserIsExist, register, sendValidateCode, validateCode} from "@/api";
import {useRouter} from "vue-router";
import md5 from "js-md5"
import {
  onFormValidate,
  useGetDisabled,
  useGetErrorMsg,
  useGetTermsOfServiceUrl,
  useGetValidateRes, usePrivacyAgreementUrl
} from "@/libs/useAction";
import {alert} from '@/libs/common'
import {useAppStore} from "@/store";

const expireCount = 120
const sendCodeLoading = ref(false)
const registerLoading = ref(false)
const ruleForm = ref(null)
const sendCodeTime = ref(expireCount)
const sendCodeTimer = ref(null)
const router = useRouter()
const store = useAppStore()
const  form = reactive({
  username:null,
  password:null,
  confirmPassword:null,
  code:null,
  isReadArticle:null
})
let rules = ref({
  username:[
    {required: true, message: '邮箱必填', trigger: 'blur'},
    {type: 'email', message: '邮箱格式不正确', trigger: 'blur'},
    {validator(rule,value,callback){
        if(value){
          checkUserIsExist(value).then(res=>{
            if(res.success) {
              callback()
            }else{
              callback('该邮箱已注册')
            }
          }).catch(err=>{
            callback('该邮箱已注册')
          })
        }
      },trigger:'blur'}],
  code:[
    {required: true, message: '验证码必填', trigger: 'blur'},
    {validator(rule, value, callback){
        if(value&&form.username){
          validateCode(value,form.username).then(res=>{
            if(res.success&&res.data){
              callback()
            }else{
              callback('验证码不正确')
            }
          }).catch(err=>{
            callback('验证码不正确')
          })
        }
      }, trigger: 'blur'}],
  password:[{required: true, message: '密码必填', trigger: 'blur'}],
  confirmPassword:[
    {required: true, message: '确认密码必填', trigger: 'blur'},
    {
      validator(rule, value, callback){
        value!==form.password?callback('两次输入不匹配'):callback()
      }, trigger: 'blur'
    }],
  isReadArticle:[
    {validator:(rule,value,callback)=>{
        value?callback():callback('请阅读"服务条款"和隐私策略"')
      }, trigger: 'change'}
  ]
})
const validateRes = useGetValidateRes(form)
const registerDisable = useGetDisabled(validateRes)
const errorMsg = useGetErrorMsg(validateRes)

function onSubmit(){
  registerLoading.value = true
  ruleForm.value.validate(valid=>{
    if(valid){
      const registerData = JSON.parse(JSON.stringify(form))
      registerData.password = md5(form.password)
      registerData.confirmPassword = null
      register(registerData).then(res=>{
        if(res.success){
          alert('注册成功','',{callback(){
              store.setUserInfo(res.data)
              store.setToken(res.data.accessToken)
              router.push({
                name:'Dashboard'
              })
          }})
        }else{
          alert(res.message||'注册失败')
        }
      }).finally(()=>{
        registerLoading.value = false
      })
    }
  })
}

function onSendCode(){
  const _rules = rules.value
  rules.value = {
    username:rules.value.username
  }
  ruleForm.value.validate(valid=>{
    if(valid){
      sendCodeLoading.value = true
      sendValidateCode(form.username).then(res=>{
        if(res.success){
          ElMessage.success('发送成功')
          sendCodeTime.value = expireCount
          startSendCodeTimer()
        }
      }).finally(()=>{
        sendCodeLoading.value = false
        rules.value = _rules
      })
    }
    rules.value = _rules
  })
}

function startSendCodeTimer(){
  sendCodeTimer.value = window.setInterval(()=>{
    sendCodeTime.value--
    if(sendCodeTime.value<=0){
      clearSendCodeTimer()
    }
  },1000)
}

function clearSendCodeTimer(){
  window.clearInterval(sendCodeTimer.value)
  sendCodeTimer.value = null
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
          欢迎注册
        </h1>
        <ul v-show="errorMsg.length>0" class="error-msg">
          <li v-for="item in errorMsg" :key="item">
            {{item}}
          </li>
        </ul>
        <el-form :model="form" ref="ruleForm" :validate-on-rule-change="false"
                 :hide-required-asterisk="true"
                 :show-message="false"
                 label-position="top" label-width="auto" :rules="rules"
                 @validate="(prop,valid,value)=>{onFormValidate(validateRes,{prop,valid,value})}">
          <el-form-item label="邮箱" prop="username">
            <el-input size="default" v-model="form.username"></el-input>
          </el-form-item>
          <el-form-item label="验证码" prop="code">
            <div class="captcha-form-item">
              <el-input size="default" v-model="form.code" @keydown.enter="onSubmit"></el-input>
              <el-button size="default" type="success"
                         @click="onSendCode"
                         :disabled="sendCodeTimer!==null||validateRes.username.valid===false"
                         :loading="sendCodeLoading">{{`${sendCodeTimer?sendCodeTime+'s':'发送'}`}}</el-button>
            </div>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input size="default" type="password" v-model="form.password" @keydown.enter="onSubmit"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input size="default" type="password" v-model="form.confirmPassword" @keydown.enter="onSubmit"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button size="default" class="btn" type="success" :loading="registerLoading" :disabled="registerDisable" @click="onSubmit">注册并登录</el-button>
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
        <router-link :to="{name:'Login'}">返回登录</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.captcha-form-item{
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  grid-gap: 8px;
  .el-button{
    width: 120px;
  }
}
.error-msg{
  white-space: pre-line;
  margin: 12px 0px;
  padding: 12px 0;
  background: var(--el-color-warning-light-9);
  border-radius: 4px;
  color: var(--el-color-warning);
  list-style: disc inside;
  li{
    padding: 0px 12px;
  }
  li+li{
    margin-top: 4px;
  }
}
</style>
<style lang="less">
.login-register-form{
  .el-form-item.is-error .el-input__wrapper{
    box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color)) inset;;
  }
}
</style>