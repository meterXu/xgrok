<script setup lang="ts">
import {reactive, computed, ref, watch, onMounted, shallowReactive} from 'vue'
import type {FormInstance} from 'element-plus'
import {mappingDic, useSaveOrUpdate} from "@/libs/utils/index.js";
import {addServer, detailServer, detailUser, getDict, productQuery, userQuery} from "@/api";
import {StatusEnum} from "@/libs/enum";

interface Props {
  formData: Partial<ServerType>
}

const props = defineProps<Props>()
const dialogVisible = defineModel()
const emit = defineEmits(['close'])
const ruleFormRef = ref<FormInstance>()
const rules = reactive({
  name: [{required: true, message: '请输入服务名称', trigger: 'blur'}],
  domain:[{required: true, message: '请输入服务域名',pattern:/^(?!:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/g, trigger: 'blur'}],
  port:[{required: true, message: '请输入服务端口', trigger: 'blur'}],
  type:[{required: true, message: '请选择服务类型', trigger: 'blur'}],
  http_port:[{required: true, message: '请输入http端口', trigger: 'blur'}],
  https_port:[{required: true, message: '请输入https端口', trigger: 'blur'}],
  is_vip: [{required: true, message: '请选择是否付费', trigger: 'blur'}],
  is_online: [{required: true, message: '请选择是否在线', trigger: 'blur'}]
})
const serverStatus = reactive<DictItemType[]>([])
const isOnline = reactive<DictItemType[]>([])
const isVip = reactive<DictItemType[]>([])
const searchUserLoading = ref(false)
const userOptions = shallowReactive<UserType[]>([])
const saveLoading = ref(false)
const productList = shallowReactive<ProductType[]>([])

function handleCancel() {
  ruleFormRef.value?.resetFields()
  dialogVisible.value = false
  emit('close')
}

const dialogTitle = computed(() => {
  return props.formData.id? '修改数据' : '添加数据'
})

watch(dialogVisible, (nv) => {
  if(nv){
    initUserOptions()
    ruleFormRef.value?.clearValidate()
  }
})

function remoteMethod(query: string) {
  searchUserLoading.value = true
  userQuery({pageNumber: 1, pageSize: 20, username: query}).then(res => {
    if (res.success && res.data) {
      userOptions.splice(0, userOptions.length)
      userOptions.push(...res.data.records)
    }
  }).finally(() => {
    searchUserLoading.value = false
  })
}

function initUserOptions() {
  if (props.formData.creator) {
    detailUser({id: props.formData.creator}).then(res => {
      if (res.success && res.data) {
        userOptions.splice(0, userOptions.length, {
          id: res.data.id,
          username: res.data.username,
        } as UserType)
      }
    })
  }
}

function getProductList(){
  productQuery({pageNumber: 1, pageSize: 999}).then(res => {
    if (res.success && res.data) {
      productList.splice(0,productList.length,...res.data.records)
    }
  })
}

function handleOk() {
  ruleFormRef.value?.validate(async valid => {
    if (valid) {
      saveLoading.value=true
      try {
        let res = props.formData.id?await detailServer(props.formData):await addServer(props.formData)
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

onMounted(() => {
  mappingDic([getDict('server_type'),getDict('is_online'),getDict('is_vip')], [serverStatus,isOnline,isVip])
  getProductList()
})

</script>

<template>
  <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="36%"
      @close="handleCancel">
    <el-form :model="formData" :rules="rules" ref="ruleFormRef" label-width="140px" class="demo-ruleForm">
      <el-form-item label="服务名称" prop="name">
        <el-col :span="21">
          <el-input v-model="formData.name" placeholder="请输入服务名称"/>
        </el-col>
      </el-form-item>
      <el-form-item label="服务域名" prop="domain">
        <el-col :span="21">
          <el-input v-model="formData.domain" placeholder="请输入服务域名"/>
        </el-col>
      </el-form-item>
      <el-form-item label="服务类型" prop="type">
        <el-col :span="21">
          <el-select v-model="formData.type" placeholder="请选择服务类型">
            <el-option v-for="item in serverStatus" :label="item.chn_value" :value="parseInt(item.code)"></el-option>
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item label="服务端口" prop="port">
        <el-col :span="21">
          <el-input-number v-model="formData.port" placeholder="请输入服务端口"/>
        </el-col>
      </el-form-item>
      <el-form-item label="HTTP端口" prop="http_port">
        <el-col :span="21">
          <el-input-number v-model="formData.http_port" placeholder="HTTP端口"/>
        </el-col>
      </el-form-item>
      <el-form-item label="HTTPS端口" prop="https_port">
        <el-col :span="21">
          <el-input-number v-model="formData.https_port" placeholder="HTTPS端口"/>
        </el-col>
      </el-form-item>
      <el-form-item label="支持HTTPS" prop="has_ssl">
        <el-col :span="21">
          <el-checkbox v-model="formData.has_ssl" :true-value="StatusEnum.enable" :false-label="StatusEnum.disable" placeholder="支持HTTPS"/>
        </el-col>
      </el-form-item>
      <el-form-item label="上行速度">
        <el-col :span="21">
          <el-input v-model="formData.up_speed" placeholder="上行速度"/>
        </el-col>
      </el-form-item>
      <el-form-item label="下行速度">
        <el-col :span="21">
          <el-input v-model="formData.down_speed" placeholder="下行速度"/>
        </el-col>
      </el-form-item>
      <el-form-item label="是否在线" prop="is_online">
        <el-select v-model="formData.is_online" placeholder="请选择是否在线">
          <el-option v-for="item in isOnline" :label="item.chn_value" :value="parseInt(item.code)"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="付费使用" prop="is_vip">
        <el-select v-model="formData.is_vip" placeholder="请选择是否付费使用">
          <el-option v-for="item in isVip" :label="item.chn_value" :value="parseInt(item.code)"></el-option>
        </el-select>
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
