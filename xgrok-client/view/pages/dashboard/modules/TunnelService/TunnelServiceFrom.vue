<script setup>
import {reactive, defineEmits, ref, watch} from "vue";
import {checkName, checkPort, createTunnelService, queryRange, updateTunnelService} from "@/api";
import {useAppStore} from "@/store";
import {ElMessage} from "element-plus";
import {tunnelType} from "@/libs/enums";
import InfoTip from "@/components/infoTip.vue";
import {tipText} from "@/libs/infoText";
import {testName,isLocalHost} from "@/libs/common";
import {onFormValidate, useGetDisabled, useGetErrorMsg} from "@/libs/useAction";

const store = useAppStore()
const {selectedServer,clientId,tunnelForm} = store
const emits = defineEmits(['updateSuccess','cancel','createSuccess'])
const ruleFormRef = ref('ruleFormRef')
const portRange = ref(null)
const saveLoading = ref(false)
const validateNameLoading = ref(false)
const validateRemotePortLoading = ref(false)
const validateLocalPortLoading = ref(false)
const formData = reactive({
  id:tunnelForm.value?.id,
  name:tunnelForm.value?.name,
  remark:tunnelForm.value?.remark,
  type:tunnelForm.value?.type||1,
  host:tunnelForm.value?.host||'127.0.0.1',
  server_id:tunnelForm.value?.server_id||selectedServer.value.id,
  client_id:tunnelForm.value?.client_id||clientId.value,
  port:tunnelForm.value?.port,
  remote_port:tunnelForm.value?.remote_port,
  is_remote:tunnelForm.value?.is_remote||0,
})
const validateRes = reactive({name:{value:null,valid:true},type:{value:null,valid:true},remark:{value:null,valid:true},host:{value:null,valid:true},port:{value:null,valid:true},remote_port:{value:null,valid:true}})
const rules = {
  name:[
    { required: true, message: '请输入名称', trigger: 'change' },
    { validator: validateName, trigger: 'change'},
  ],
  remark:[
    { max: 50, message: '最多50个字', trigger: 'change' }
  ],
  host:[
    { required: true, message: '请输入代理地址', trigger: 'change',regexp:/^((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))|(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/g },
    { max: 200, message: '最多200个字', trigger: 'change' }
  ],
  port:[
    { type: 'integer',required: true, message: '请输入代理端口', trigger: 'change' },
  ],
  remote_port:[
    { type: 'integer',required: true, message: '请输入映射端口', trigger: 'change' },
    { validator: validatePort, trigger: 'change'},
  ]
}
const errorMsg = useGetErrorMsg(validateRes)
const addBtnDisabled = useGetDisabled(validateRes)

watch(()=>formData.host,(nv)=>{
  formData.is_remote = isLocalHost(nv)?0:1
})

function onSave(){
  saveLoading.value=true
  ruleFormRef.value.validate(valid=>{
    if(valid){
      formData.id?updateTunnelService(formData).then(res=>{
            ElMessage({
              message: res.success?'更新成功':'更新失败',
              type: res.success?'success':'error',
              plain: true,
            })
            if(res.success){
              emits('cancel')
              emits('updateSuccess')
            }
          }).finally(()=>{
            saveLoading.value=false
          })
      :createTunnelService(formData).then(res=>{
        if(res.success){
          ElMessage({
            message: '创建成功',
            type: 'success',
            plain: true,
          })
          emits('cancel')
          emits('createSuccess')
        }else{
          ElMessage({
            message: '创建失败',
            type: 'error',
            plain: true,
          })
        }
      }).finally(()=>{
        saveLoading.value=false
      })
    }else{
      saveLoading.value=false
    }
  })
}
function created(){
  queryRangeByType()
}
function validateName(rule, value, callback){
  if (!value) {
    callback(new Error('请输入名称'))
  } else if(!testName(value)) {
    callback(new Error('名称不符合格式'))
  } else {
    validateNameLoading.value = true
    checkName.debounce()(selectedServer.value.domain,tunnelType.service,selectedServer.value.http_port,value,selectedServer.value.id,clientId.value,formData.id||'').then(res=>{
      if(res.success){
        validateNameLoading.value = false
        callback(res.data?undefined:new Error(res.message))
      }
    })
  }
}
function validatePort(rule, value, callback){
  if (!value) {
    callback(new Error('请输入名称'))
  } else {
    validateRemotePortLoading.value = true
    checkPort.debounce()(selectedServer.value.domain,value,selectedServer.value.id,formData.id||'',formData.type).then(res=>{
      if(res.success){
        callback(res.data?undefined:new Error(res.message))
      }
    }).catch(err=>{
      callback(err)
    }).finally(()=>{
      validateRemotePortLoading.value = false
    })
  }
}
function onCancel(){
  ruleFormRef.value.resetFields()
  emits('cancel')
}
function queryRangeByType(){
  queryRange(selectedServer.value.id,formData.type).then(res=>{
    if(res.success){
      portRange.value = res.data.records.map(c=>{
        return `${c.min_port}-${c.max_port}`
      }).join(',')
    }
  })
}
function onChangeType(){
  queryRangeByType()
  ruleFormRef.value.validateField('remote_port')
}
created()
</script>

<template>
  <TransitionGroup tag="ul" v-show="errorMsg.length>0" name="fade" class="error-msg">
    <li v-for="item in errorMsg" :key="item">
      {{item}}
    </li>
  </TransitionGroup>
  <el-form ref="ruleFormRef" class="ruleFormRef" :model="formData"
           label-width="auto"
           :rules="rules"
           size="default"
           :hide-required-asterisk="true"
           :show-message="false"
           @validate="(prop,valid,value)=>{onFormValidate(validateRes,{prop,valid,value})}">
    <el-form-item label="名称" prop="name">
      <el-input v-model="formData.name" placeholder="请输入名称">
        <template #suffix>
          <InfoTip :text="tipText.zh.name" :loading="validateNameLoading"></InfoTip>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item label="代理地址" prop="host">
      <el-input v-model="formData.host" placeholder="请输入代理地址">
        <template #suffix>
          <InfoTip :text="tipText.zh.host"></InfoTip>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item label="代理类型" prop="type">
      <el-radio-group v-model="formData.type" @change="onChangeType">
        <el-radio-button label="TCP" :value="1" />
        <el-radio-button label="UDP" :value="2" />
      </el-radio-group>
    </el-form-item>
    <el-form-item label="代理端口" prop="port">
      <div class="port-wrap">
        <el-input-number v-model="formData.port" placeholder="端口号"></el-input-number>
        <div class="port-content">
          <InfoTip :text="tipText.zh.port" :loading="validateLocalPortLoading"></InfoTip>
        </div>
      </div>
    </el-form-item>
    <el-form-item label="映射端口" prop="remote_port">
      <div class="port-wrap">
        <el-input-number v-model="formData.remote_port" placeholder="端口号"></el-input-number>
        <div class="port-content">
          <div class="port-rang-content">端口范围：{{portRange||'-'}}</div>
          <InfoTip :text="tipText.zh.remote_port" :loading="validateRemotePortLoading"></InfoTip>
        </div>
      </div>
    </el-form-item>
    <el-form-item label="描述" prop="remark">
      <el-input type="textarea" v-model="formData.remark" placeholder="请输入描述"></el-input>
    </el-form-item>
  </el-form>
  <div class="form-btns">
    <el-button type="success" plain :disabled="addBtnDisabled" :loading="saveLoading" @click="onSave">
      <template #icon>
        <i-ep-check/>
      </template>
      确定</el-button>
    <el-button type="info" plain @click="onCancel">
      <template #icon>
        <i-ep-close/>
      </template>
      取消</el-button>
  </div>
</template>

<style scoped lang="less">
@import url('../../../../assets/mixin.less');
.form-btns{
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 60px;
}
.port-wrap{
  display: flex;
  align-items: center;
  justify-content: flex-start;
  grid-gap: 12px;
}
.port-content{
  display: flex;
  justify-content: flex-start;
  align-items: center;
  grid-gap: 8px;
}
.port-rang-content{
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  .pxToVW(390,max-width);
}
.error-msg{
  white-space: pre-line;
  margin: 12px 0;
  padding: 12px 0;
  background: var(--el-color-warning-light-9);
  border-radius: 4px;
  color: var(--el-color-warning);
  list-style: disc inside;
  li{
    padding: 0 12px;
  }
  li+li{
    margin-top: 4px;
  }
  .fade-move,
  .fade-enter-active,
  .fade-leave-active {
    transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
    transform: scaleY(0.01) translate(30px, 0);
  }
  .fade-leave-active {
    position: absolute;
  }
}
</style>
<style lang="less">
.ruleFormRef{
  .el-form-item.is-error .el-input__wrapper{
    box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color)) inset;;
  }
}
</style>
