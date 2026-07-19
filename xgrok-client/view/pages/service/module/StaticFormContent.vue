<script setup>
import RefreshButton from "@/components/RefreshButton.vue";
import InfoTip from "@/components/infoTip.vue";
import {ref} from "vue";
import {tipText} from "@/libs/infoText";
import {useAppStore} from "@/store";
import {encryptData, testName} from "@/libs/common";
import {checkName, checkPort, checkServiceByWebClient, validateServerNameAndSecret} from "@/api";
import {serviceType, tunnelType} from "@/libs/enums";
import {useClientTypeExecute, onFormValidate, userServiceForm} from "@/libs/useAction";
const {formData} = defineProps(['formData','validateRes','portRange'])
const ruleFormRef = ref('ruleFormRef')
import {storeToRefs} from 'pinia'

const tmpFormData = userServiceForm()
const store = useAppStore()
const {selectedServer, clientId, configIsLock} = storeToRefs(store)
const validateLocalPortLoading = ref(false)
const validateNameLoading = ref(false)
const validateRemotePortLoading = ref(false)
const emits = defineEmits(['changeType'])
const rules = computed(() => {
  const _rules = {
    name: [
      {required: true, message: '请输入名称', trigger: 'blur'},
      {validator: validateName, trigger: 'blur'},
      {max: 50, message: '最多50个字', trigger: 'blur'}
    ],
    remark: [
      {max: 100, message: '最多100个字', trigger: 'change'}
    ],
    host: [
      {
        required: true,
        message: '请输入代理地址',
        trigger: 'change',
        pattern: /^((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))|(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/g
      },
      {max: 200, message: '最多200个字', trigger: 'change'}
    ],
    secret_key:[],
    port: [],
    remote_port: []
  }
  if([serviceType.TCP,serviceType.UDP].includes(formData.type)){
    _rules.port=[
      {type: 'integer', required: true, message: '请输入本地端口', trigger: 'change'},
    ]
    _rules.remote_port = [
      {type: 'integer', required: true, message: '请输入映射端口', trigger: 'change'},
      {validator: validatePort, trigger: 'change'},
    ]
    _rules.server_name=[]
    _rules.secret_key=[]
  }else{
    _rules.port= formData.type===serviceType.STCP_SERVER?
        [{type: 'integer', required: true, message: '请输入本地端口', trigger: 'change'}] :
        [{type: 'integer', required: true, message: '请输入本地端口', trigger: 'change'},{validator: validateLocalPort, trigger: 'change'}]
    _rules.remote_port = []
    _rules.server_name=formData.type===serviceType.STCP_SERVER?[]:[
      {required: true, message: '请输入需要连接的隧道名称', trigger: 'blur'},
      {max: 50, message: '最多50个字', trigger: 'blur'},
      {validator: validateServerName, trigger: 'blur'},
    ]
    _rules.secret_key = formData.type===serviceType.STCP_SERVER?[
      {required: true, message: '请输入隧道密码', trigger: 'blur'},
      {max: 16, message: '最多16个字', trigger: 'blur'}
    ]:[
      {required: true, message: '请输入隧道密码', trigger: 'blur'},
      {max: 16, message: '最多16个字', trigger: 'blur'},
      {validator: validatePassword, trigger: 'blur'},
    ]
  }
  return _rules
})

watch(()=>formData.id,(nv) => {
  Object.assign(tmpFormData,formData)
},{immediate: true})

function validateName(rule, value, callback) {
  if (!value) {
    callback(new Error('请输入名称'))
  } else if (!testName(value)) {
    callback(new Error('名称不符合格式'))
  } else {
    validateNameLoading.value = true
    checkName.debounce()(selectedServer.value.domain, tunnelType.service, selectedServer.value.http_port, value, selectedServer.value.id, clientId.value, formData.id || '').then(res => {
      if (res.success) {
        validateNameLoading.value = false
        callback(res.data ? undefined : new Error(res.message))
      }
    })
  }
}
function validateServerName(rule, value, callback) {
  if (!value) {
    callback(new Error('请输入名称'))
  } else if (!testName(value)) {
    callback(new Error('名称不符合格式'))
  } else {
    validateNameLoading.value = true
    checkName.debounce()(selectedServer.value.domain, tunnelType.service, selectedServer.value.http_port, value, selectedServer.value.id, clientId.value, formData.id || '').then(res => {
      if (res.success) {
        validateNameLoading.value = false
        callback(res.data ? new Error('该隧道不存在'):undefined)
      }
    })
  }
}
function validatePort(rule, value, callback) {
  if (!value) {
    callback(new Error('请输入名称'))
  } else {
    validateRemotePortLoading.value = true
    checkPort.debounce()(selectedServer.value.domain, value, selectedServer.value.id, formData.id || '', formData.type).then(res => {
      if (res.success) {
        callback(res.data ? undefined : new Error(res.message))
      }
    }).catch(err => {
      callback(err)
    }).finally(() => {
      validateRemotePortLoading.value = false
    })
  }
}
function validateLocalPort(rule, value, callback) {
  if(tmpFormData.port===value){
    callback()
    return
  }
  validateLocalPortLoading.value = true
  useClientTypeExecute(
      ()=>checkServiceByWebClient(formData.host, formData.port,serviceType.TCP),
      ()=>window.electronAPI.checkPort({host:formData.host,port:formData.port,type:serviceType.TCP}))
      .then(res=>{
        callback(res.data ? undefined : res.message)
      }).finally(() => {
        validateLocalPortLoading.value = false
      })
}
function validatePassword(rule, value, callback) {
  validateServerNameAndSecret(selectedServer.value.id,formData.server_name,encryptData(value)).then(res=>{
    callback(res.data? undefined : new Error(res.message))
  })
}

defineExpose({
  validate:(callback)=>ruleFormRef.value.validate(callback),
  resetFields:()=>ruleFormRef.value.resetFields,
  validateField:(field)=>ruleFormRef.value.validateField(field),
})
</script>

<template>
  <el-form ref="ruleFormRef" class="ruleFormRef" :model="formData"
           label-width="auto"
           :rules="rules"
           size="default"
           :hide-required-asterisk="true"
           :show-message="false"
           :validateOnRuleChange="false"
           :disabled="configIsLock"
           @validate="(prop,valid,value)=>{onFormValidate(validateRes,{prop,valid,value})}">
    <el-form-item label="名称" prop="name">
      <div class="w-full flex justify-start items-center gap-4">
        <el-input v-model="formData.name" placeholder="请输入名称">
          <template #suffix>
            <InfoTip :text="tipText.zh.name" :loading="validateNameLoading"></InfoTip>
          </template>
        </el-input>
        <RefreshButton @click="emits('queryRandomName')"></RefreshButton>
      </div>
    </el-form-item>
    <el-form-item label="代理地址" prop="host">
      <el-input v-model="formData.host" placeholder="请输入代理地址" :disabled="formData.type===serviceType.STCP_CLIENT">
        <template #suffix>
          <InfoTip :text="tipText.zh.host"></InfoTip>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item label="代理类型" prop="type">
      <el-radio-group v-model="formData.type" @change="(value)=>emits('changeType',value)">
        <el-radio-button label="TCP" :value="serviceType.TCP"/>
        <el-radio-button label="UDP" :value="serviceType.UDP"/>
        <el-radio-button label="STCP_SERVER" :value="serviceType.STCP_SERVER"/>
        <el-radio-button label="STCP_CLIENT" :value="serviceType.STCP_CLIENT"/>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="连接隧道" v-if="[serviceType.STCP_CLIENT].includes(formData.type)" prop="server_name">
      <el-input v-model="formData.server_name" placeholder="请输入需要连接的隧道名称"/>
    </el-form-item>
    <el-form-item label="隧道密码" v-if="[serviceType.STCP_CLIENT,serviceType.STCP_SERVER].includes(formData.type)" prop="secret_key">
      <el-input type="password" v-model="formData.secret_key" placeholder="请输入隧道密码" show-password/>
    </el-form-item>
    <el-form-item label="本地端口" prop="port" v-if="[serviceType.TCP,serviceType.UDP,serviceType.STCP_SERVER,serviceType.STCP_CLIENT].includes(formData.type)">
      <div class="port-wrap">
        <el-input-number v-model="formData.port" placeholder="端口号"></el-input-number>
        <div class="port-content">
          <InfoTip :text="tipText.zh.port" :loading="validateLocalPortLoading"></InfoTip>
        </div>
      </div>
    </el-form-item>
    <el-form-item label="映射端口" prop="remote_port" v-if="[serviceType.TCP,serviceType.UDP].includes(formData.type)">
      <div class="port-wrap">
        <div class="flex justify-start items-center gap-4">
          <el-input-number v-model="formData.remote_port" placeholder="端口号"></el-input-number>
          <RefreshButton @click="emits('queryFreePort')"></RefreshButton>
        </div>
        <div class="port-content">
          <div class="port-rang-content">端口范围：{{ portRange || '-' }}</div>
          <InfoTip :text="tipText.zh.remote_port" :loading="validateRemotePortLoading"></InfoTip>
        </div>
      </div>
    </el-form-item>
    <el-form-item label="描述" prop="remark">
      <el-input type="textarea" v-model="formData.remark" placeholder="请输入描述"></el-input>
    </el-form-item>
  </el-form>
</template>
<style scoped lang="less">
@import url('@/assets/css/mixin.less');
.port-wrap {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  grid-gap: 12px;
}

.port-content {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  grid-gap: 8px;
}

.port-rang-content {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  .pxToVW(390, max-width);
}
</style>
<style lang="less">
.ruleFormRef {
  .el-form-item.is-error .el-input__wrapper {
    box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color)) inset;;
  }
}
</style>
