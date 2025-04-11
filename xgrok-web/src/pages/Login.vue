<script setup>
import {reactive} from 'vue'
const form = reactive({username: null, password: null})


function onSubmit(){
}
</script>

<template>
  <div class="login">
    <div class="title">
      <h1>Brush</h1>
    </div>
    <Form @submit="onSubmit">
      <el-input
          v-model="form.username"
          size="large"
          name="username"
          label="用户名"
          placeholder="请输入用户名"
      />
      <el-input
          v-model="form.password"
          size="large"
          type="password"
          name="password"
          label="密码"
          placeholder="请输入密码"
      />
      <div class="login-btn">
        <el-button :disabled="disabled" type="success" size="large" hairline block native-type="submit">登 录</el-button>
      </div>
    </Form>
  </div>
</template>

<style scoped>
.login{
  padding: 0 5vw;
  height: 100vh;
  margin: 0 auto;
}
.title{
  padding: 57px 0 20px 0;
}
.title img{
  width: 102px;
}
.title h1{
  margin: 42px auto 12px auto;
  font-size: 32px;
  text-align: center;
}
.login-btn{
  margin: 60px auto;
  width: 270px;
}
</style>
<style>
.login-btn .van-button__text{
  font-size: 18px;
}
.login .van-field__control{
  font-size:18px
}
.login .van-field__control::-webkit-input-placeholder{
  font-size:14px
}
</style>
