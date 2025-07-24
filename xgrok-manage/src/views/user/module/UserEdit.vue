<script setup lang="ts">
import {reactive, computed, ref, watch, onMounted} from 'vue'
import type {FormInstance} from 'element-plus'
import {mappingDic, useSaveOrUpdate} from "@/libs/utils/index.js";
import {addUser, editUser, getDict} from "@/api";

interface Props {
  formData: UserType
}

const props = defineProps<Props>()
const dialogVisible = defineModel()
const emit = defineEmits(['close'])
const ruleFormRef = ref<FormInstance>()
const rules = reactive({
  username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
  password:[{required: true, message: '请输入密码', trigger: 'blur'}],
  confirmPassword:[{required: true, message: '请再次输入密码', trigger: 'blur'},{
    validator: (rule: any, value: any, callback: any) => {
      if (!value) {
        callback(new Error('请再次输入密码'))
      } else if (value !== props.formData.password) {
        callback(new Error("两次密码输入不一致"))
      } else {
        callback()
      }
    }, trigger: 'blur'
  }]
})
const saveLoading = ref(false)
const status = reactive<DictItemType[]>([])
const isDelete = reactive<DictItemType[]>([])

function handleCancel() {
  ruleFormRef.value?.resetFields()
  dialogVisible.value = false
  emit('close')
}

const dialogTitle = computed(() => {
  return props.formData.id? '修改用户' : '添加用户'
})

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
        let res = props.formData.id?await editUser(props.formData as UserType):await addUser(props.formData as UserType)
        useSaveOrUpdate(res,props.formData.id).then(()=>{
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
      :title="dialogTitle"
      v-model="dialogVisible"
      width="36%"
      @close="handleCancel">
    <el-form :model="formData" :rules="rules" ref="ruleFormRef" label-width="140px" class="demo-ruleForm">
      <el-form-item label="用户名" prop="username">
        <el-col :span="21">
          <el-input v-model="formData.username" placeholder="请输入用户名"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-col :span="21">
          <el-input type="password" v-model="formData.password" placeholder="请输入密码"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="密码" prop="confirmPassword">
        <el-col :span="21">
          <el-input type="password" v-model="formData.confirmPassword" placeholder="请再次输入密码"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="昵称" prop="nickname">
        <el-col :span="21">
          <el-input v-model="formData.nickname" placeholder="请输入昵称"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="是否启用" prop="status">
        <el-col :span="21">
          <el-switch v-model="formData.status" :inactive-value="0" :active-value="1"></el-switch>
        </el-col>
      </el-form-item>
      <el-form-item label="是否删除" prop="is_delete">
        <el-col :span="21">
          <el-switch v-model="formData.is_delete" :inactive-value="0" :active-value="1"
                     style="--el-switch-on-color: var(--el-color-danger);"></el-switch>
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
