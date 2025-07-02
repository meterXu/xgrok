<script setup>
import {defineProps,defineEmits,reactive,defineModel,computed,ref,watch,nextTick} from 'vue'
import {ElMessage } from 'element-plus'
import {useSaveOrUpdate} from "@/libs/utils/index.js";

const props = defineProps(['dialogType','formData'])
const dialogVisible = defineModel()
const emit = defineEmits(['close'])
const ruleFormRef = ref(null)
const rules = reactive({
  /** generate by CodeGirl */
  pay_status:[{ required: true, message: '付款状态必选', trigger: 'blur' }]
})
function handleCancel(){
  ruleFormRef.value.resetFields()
  emit('close')
}

async function handleOk(){
  ruleFormRef.value.validate(async valid=>{
    if(valid){
      let res=null
      if(props.formData.id){
        // res = await putAction(urls.{{modelNameSub}}.modify,props.formData)
      }else{
        // res = await postAction(urls.{{modelNameSub}}.modify,props.formData)
      }
      useSaveOrUpdate(res,props.formData.id)
    }
  })
}

watch(dialogVisible,()=>{
  dialogVisible&&nextTick(()=>{ruleFormRef.value.clearValidate()})
})

const dialogTitle = computed(()=>{
  return props.dialogType==='add'?'添加数据':'修改数据'
})
</script>

<template>
  <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="36%"
      @close="handleCancel">
    <el-form :model="formData" :rules="rules" ref="ruleFormRef" label-width="140px" class="demo-ruleForm">
      <!-- generate by CodeGirl -->
      <el-form-item label="购买时间" prop="payed_time">
        <el-col :span="21">
          <el-input v-model="formData.payed_time" placeholder="请选择购买时间"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="支付状态" prop="pay_status">
        <el-col :span="21">
          <el-input v-model="formData.pay_status" placeholder="请选择支付状态"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="过期时间" prop="expired_time">
        <el-col :span="21">
          <el-input v-model="formData.expired_time" placeholder="请选择过期时间"></el-input>
        </el-col>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleOk">确 定</el-button>
      <el-button @click="handleCancel">取 消</el-button>
    </span>
  </el-dialog>
</template>

<style scoped>
.dialog-footer{
  display: flex;
  align-items: center;
  justify-content: center;
  grid-gap: 8px;
}
</style>