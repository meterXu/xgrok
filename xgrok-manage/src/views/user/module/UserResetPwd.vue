<script setup lang="ts">
import {computed, ref, watch, onMounted} from 'vue'
import type {FormInstance} from 'element-plus'
import {resetObj, useSaveOrUpdate} from "@/libs/utils/index.js";
import {editUser} from "@/api";
import md5 from "js-md5"

interface Props {
  formData: UserType
}

const props = defineProps<Props>()
const dialogVisible = defineModel()
const emit = defineEmits(['close'])
const ruleFormRef = ref<FormInstance>()
const rules = computed(()=>{
  return {
    password:[{required:true,message: '请输入密码', trigger: 'blur'}],
    confirmPassword:[{required:true,message: '请再次输入密码', trigger: 'blur'},{
      validator: (rule: any, value: any, callback: any) => {
        if (value !== props.formData.password) {
          callback(new Error("两次密码输入不一致"))
        } else {
          callback()
        }
      }, trigger: 'blur'
    }]
  }
})
const saveLoading = ref(false)

function handleCancel() {
  ruleFormRef.value?.resetFields()
  dialogVisible.value = false
  resetObj(props.formData)
  emit('close')
}

watch(dialogVisible, (nv) => {
  if(nv){
    ruleFormRef.value?.clearValidate()
  }
})

function handleOk() {
  ruleFormRef.value?.validate(async valid => {
    if (valid) {
      saveLoading.value=true
      try {
        const _formData = JSON.parse(JSON.stringify(props.formData))
        _formData.password = md5(_formData.password)
        let res = await editUser(_formData as UserType)
        useSaveOrUpdate(res,_formData.id).then(()=>{
          handleCancel()
        }).finally(()=> {
          saveLoading.value=false
        })
      }catch (err){
        saveLoading.value=false
      }
    }
  })
}

onMounted(() => {})

</script>
<template>
  <el-dialog
      title="重置密码"
      v-model="dialogVisible"
      width="36%"
      @close="handleCancel">
    <el-form :model="formData" :rules="rules" ref="ruleFormRef" label-width="140px" class="demo-ruleForm">
      <el-form-item label="用户名">
        <el-col :span="21">
          <label class="font-bold">{{formData.username}}</label>
        </el-col>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-col :span="21">
          <el-input type="password" v-model="formData.password" placeholder="请输入密码"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-col :span="21">
          <el-input type="password" v-model="formData.confirmPassword" placeholder="请再次输入密码"></el-input>
        </el-col>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleOk" :loading="saveLoading">确 定</el-button>
      <el-button @click="handleCancel">取 消</el-button>
    </span>
  </el-dialog>
</template>

<style scoped>
.dialog-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  grid-gap: 8px;
}
</style>
