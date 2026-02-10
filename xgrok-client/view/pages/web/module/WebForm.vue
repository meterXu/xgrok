<script setup>
import {reactive, defineEmits, ref, watch} from "vue";
import {isOnline, NotificationType, tunnelType} from "@/libs/enums";
import {getUrlSchema} from "@/libs/common";
import {checkName, createTunnelWeb, updateTunnelWeb} from "@/api";
import {useAppStore} from "@/store";
import {tipText} from "@/libs/infoText";
import InfoTip from "@/components/infoTip.vue";
import {confirm, testName, isLocalHost} from "@/libs/common";
import {onFormValidate, operationConfirm, useGetDisabled, useGetErrorMsg} from "@/libs/useAction";
import {useRouter} from "vue-router";
import {showNotification} from "@/libs/message";
import {$emit} from 'xxweb-util'

const store = useAppStore()
const {selectedServer, clientId,configIsLock,pid} = store
const props = defineProps(['tunnelForm'])
const emits = defineEmits(['updateSuccess', 'cancel', 'createSuccess'])
const ruleFormRef = ref('ruleFormRef')
const saveLoading = ref(false)
const validateNameLoading = ref(false)
const router = new useRouter()

const formData = reactive({
  id: null,
  name: null,
  remark: null,
  type: null,
  host: null,
  is_remote: null,
  server_id: null,
  client_id: null,
  port: null,
  is_online: null
})

watchEffect(() => {
  formData.id = props.tunnelForm?.id
  formData.name = props.tunnelForm?.name
  formData.remark = props.tunnelForm?.remark
  formData.type = props.tunnelForm?.type || 0
  formData.host = props.tunnelForm?.host || 'http://localhost'
  formData.is_remote = props.tunnelForm?.is_remote || 0
  formData.server_id = props.tunnelForm?.server_id || selectedServer.id
  formData.client_id = props.tunnelForm?.client_id || clientId.value
  formData.port = props.tunnelForm?.port || 80
  formData.is_online = isOnline.online
})

const validateRes = reactive({
  name: {value: null, valid: true},
  host: {value: null, valid: true},
  remark: {value: null, valid: true},
  port: {value: null, valid: true}
})
const rules = {
  name: [
    {required: true, message: '请输入名称', trigger: 'change'},
    {validator: validateName, trigger: 'change'}
  ],
  host: [
    {required: true, message: '请输入正确的网址', type: 'url', trigger: 'change'},
    {max: 200, message: '最多200个字', trigger: 'change'}
  ],
  remark: [
    {max: 50, message: '最多50个字', trigger: 'change'}
  ],
  port: [
    {type: 'integer', required: true, message: '请输入本地端口', trigger: 'change'}
  ]
}
const errorMsg = useGetErrorMsg(validateRes)
const addBtnDisabled = computed(() => {
  return useGetDisabled(validateRes).value||configIsLock.value
})

watch(() => formData.host, (nv) => {
  let urlSchema = getUrlSchema(nv)
  if (urlSchema) {
    formData.port = urlSchema.port
    formData.type = urlSchema.protocol
    formData.is_remote = isLocalHost(nv) ? 0 : 1
  }
})

const createOrUpdateText = computed(()=>{
  return formData.id? '更新' : '新增'
})

function onSave() {
  saveLoading.value = true
  ruleFormRef.value.validate(valid => {
    if (valid) {
      operationConfirm().then(()=>{
        formData.id ? updateTunnelWeb(formData).then(res => {
          showNotification(res.success ? NotificationType.success : NotificationType.error, res.success ? `${createOrUpdateText.value}成功` : `${createOrUpdateText.value}失败`)
          if (res.success) {
            emits('cancel')
            emits('updateSuccess')
            pid.value&&$emit('restart')
          }
        }).finally(() => {
          saveLoading.value = false
        }) : createTunnelWeb(formData).then(res => {
          if (res.success) {
            showNotification(NotificationType.success,  `${createOrUpdateText.value}成功`)
            emits('cancel')
            emits('createSuccess')
            pid.value&&$emit('restart')
          } else {
            confirm(res.message || `${createOrUpdateText.value}失败`, null, {
              confirmButtonText: '去捐赠',
              cancelButtonText: '知道了',
              confirmButtonClass: 'el-button--warning is-plain'
            }).then(() => {
              router.push({name: 'Plan'})
            })
          }
        }).finally(() => {
          saveLoading.value = false
        })
      }).catch(()=>{
        saveLoading.value = false
      })
    } else {
      saveLoading.value = false
    }
  })
}

function onCancel() {
  ruleFormRef.value.resetFields()
  emits('cancel')
}

function validateName(rule, value, callback) {
  if (!value) {
    callback(new Error('请输入名称'))
  } else if (!testName(value)) {
    callback(new Error('名称不符合格式'))
  } else {
    validateNameLoading.value = true
    checkName.debounce()(selectedServer.domain, tunnelType.web, selectedServer.http_port, value, selectedServer.id, clientId.value, formData.id || '').then(res => {
      if (res.success) {
        callback(res.data ? undefined : new Error(res.message))
      }
    }).catch(err => {
      callback(err)
    }).finally(() => {
      validateNameLoading.value = false
    })
  }
}
</script>

<template>
  <TransitionGroup tag="ul" v-show="errorMsg.length>0" name="fade"
                   class="error-msg border-1 border-(--el-color-warning-light-5)">
    <li v-for="item in errorMsg" :key="item">
      {{ item }}
    </li>
  </TransitionGroup>

  <el-form ref="ruleFormRef" class="ruleFormRef"
           :model="formData" label-width="auto"
           :rules="rules" size="default"
           :hide-required-asterisk="true"
           :show-message="false"
           @validate="(prop,valid,value)=>{onFormValidate(validateRes,{prop,valid,value})}">
    <el-form-item label="名称" prop="name">
      <el-input v-model="formData.name" placeholder="请输入网页名称">
        <template #suffix>
          <InfoTip :text="tipText.zh.name" :loading="validateNameLoading"></InfoTip>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item label="代理网址" prop="host">
      <el-input v-model="formData.host" placeholder="请输入网页地址">
        <template #suffix>
          <InfoTip :text="tipText.zh.url"></InfoTip>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item label="描述" prop="remark">
      <el-input type="textarea" v-model="formData.remark" placeholder="请输入描述"></el-input>
    </el-form-item>
  </el-form>
  <div class="form-btns">
    <el-button type="success" plain :loading="saveLoading" :disabled="addBtnDisabled" @click="onSave">
      <template #icon>
        <ep-check/>
      </template>
      {{ formData.id ? '更新' : '新增' }}
    </el-button>
    <el-button type="info" plain :disabled="saveLoading" @click="onCancel">
      <template #icon>
        <ep-close/>
      </template>
      取消
    </el-button>
  </div>
</template>

<style scoped lang="less">
@import url('@/assets/css/mixin.less');

.form-btns {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 60px;
}

.port-wrap {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  grid-gap: 12px;
}

.port-content {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  .pxToVW(210, width);
}

.error-msg {
  white-space: pre-line;
  margin: 12px 0;
  padding: 12px 0;
  background: var(--el-color-warning-light-9);
  border-radius: 4px;
  color: var(--el-color-warning);
  list-style: disc inside;
  position: relative;

  li {
    padding: 0 12px;
  }

  li + li {
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
.ruleFormRef {
  .el-form-item.is-error .el-input__wrapper {
    box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color)) inset;
  }
}
</style>
