<script setup lang="ts">
import {shallowReactive, ref, computed, onMounted, useTemplateRef} from "vue";
import {mappingDic, useSaveOrUpdate} from "@/libs/utils";
import {addPortRange,editPortRange, getDict} from "@/api";
import type {FormInstance} from 'element-plus'

const dialogVisible = defineModel<Boolean>({default: false})
const {formData} = defineProps<{formData:Partial<PortRangeType>}>()
const saveLoading = ref(false)
const serverTypeDict = shallowReactive<DictItemType[]>([])
const ruleFormRef = useTemplateRef<FormInstance>('ruleFormRef')
const emit = defineEmits(['close'])
const rules: any[] = [
  {}
]

const title = computed(() => {
  return formData?.id?'修改端口范围':'添加端口范围'
})

function handleCancel() {
  ruleFormRef.value?.resetFields()
  dialogVisible.value = false
  emit('close')
}

function handleOk() {
  ruleFormRef.value?.validate(async valid => {
    if (valid) {
      saveLoading.value=true
      try {
        let res = formData.id?await editPortRange(formData):await addPortRange(formData)
        useSaveOrUpdate(res,formData.id).then(()=>{
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

onMounted(() => {
  mappingDic(
      [getDict('server_type')],
      [serverTypeDict])
})

</script>

<template>
  <el-dialog :title="title" v-model="dialogVisible" width="28%" @close="handleCancel">
    <el-form :model="formData" :rules="rules" ref="ruleFormRef" label-width="130px" class="demo-ruleForm">
      <el-form-item label="类型" prop="name">
        <el-col :span="21">
          <el-select class="w-160!" v-model="formData.type">
            <el-option v-for="item in serverTypeDict" :key="item.code" :value="parseInt(item.code)" :label="item.chn_value"></el-option>
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item label="开始端口" prop="name">
        <el-col :span="21">
          <el-input-number class="w-160!" v-model="formData.min_port" placeholder="请输入开始端口"/>
        </el-col>
      </el-form-item>
      <el-form-item label="结束端口" prop="name">
        <el-col :span="21">
          <el-input-number class="w-160!" v-model="formData.max_port" placeholder="请输入结束端口"/>
        </el-col>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" :loading="saveLoading" @click="handleOk">确 定</el-button>
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