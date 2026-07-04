<script setup>
import {reactive, defineEmits, ref, watch} from "vue";
import {
  createTunnelService,
  getFreePort,
  getRandomSubName,
  queryRange,
  updateTunnelService
} from "@/api";
import {useAppStore} from "@/store";
import {hostType, isOnline, NotificationType, payPlan, serviceType} from "@/libs/enums";
import {confirm, decryptData, defaultHost, encryptData, isLocalHost, resetObj} from "@/libs/common";
import {
  gotoSubscribe,
  operationConfirm,
  resetFormValidate,
  useGetDisabled,
  useGetErrorMsg,
  userServiceForm
} from "@/libs/useAction";
import {showNotification} from "@/libs/message";
import StaticFormContent from "@/pages/service/module/StaticFormContent.vue";

const store = useAppStore()
const {selectedServer, clientId, configIsLock, pid, plan} = store
const props = defineProps(['tunnelForm'])
const emits = defineEmits(['updateSuccess', 'cancel', 'createSuccess'])
const ruleFormRef = ref('ruleFormRef')
const portRange = ref(null)
const saveLoading = ref(false)
let formData = userServiceForm()
const validateRes = reactive({
  name: {value: null, valid: true},
  type: {value: null, valid: true},
  remark: {value: null, valid: true},
  host: {value: null, valid: true},
  server_name:{value: null, valid: true},
  secret_key:{value: null, valid: true},
  port: {value: null, valid: true},
  remote_port: {value: null, valid: true}
})
const {errorMsg,pass} = useGetErrorMsg(validateRes)
const addBtnDisabled = computed(() => {
  return useGetDisabled(validateRes).value || configIsLock.value
})

watch(()=>props.tunnelForm,(nv)=>{
  formData = userServiceForm()
  Object.assign(formData,{
    id: undefined, type:1,host:defaultHost,server_id:selectedServer.id,client_id:clientId.value,is_remote:null,port:null,is_online:isOnline.online
  },nv)
  if(formData.secret_key){
    formData.secret_key = decryptData(formData.secret_key)
  }
  if(!formData.id){
    queryFreePort()
    queryRandomName()
  }
},{immediate:true,deep:true})

watch(() => formData.host, (nv) => {
  formData.is_remote = isLocalHost(nv) ? hostType.local : hostType.remote
})

function onSave() {
  ruleFormRef.value.validate(valid=>{
    if (valid) {
      saveLoading.value = true
      operationConfirm().then(({done}) => {
        const postData = JSON.parse(JSON.stringify(formData))
        if(postData.secret_key){
          postData.secret_key = encryptData(postData.secret_key)
        }
        postData.id ? updateTunnelService(postData).then(res => {
              showNotification(res.success ? NotificationType.success : NotificationType.error, res.success ? '更新成功' : '更新失败')
              if (res.success) {
                emits('cancel')
                emits('updateSuccess')
              }
            }).finally(() => {
              saveLoading.value = false
              done()
            })
            : createTunnelService(postData).then(res => {
              if (res.success) {
                showNotification(NotificationType.success, '创建成功')
                emits('cancel')
                emits('createSuccess')
              } else {
                gotoSubscribe(res.message || '创建失败')
              }
            }).finally(() => {
              saveLoading.value = false
              done()
            })
      }).catch(() => {
        saveLoading.value = false
      })
    }
  })
}

function onCancel() {
  resetFormValidate(ruleFormRef,validateRes)
  emits('cancel')
}

function onChangeType(value) {
  if ([serviceType.UDP,serviceType.STCP_CLIENT,serviceType.STCP_SERVER].indexOf(value)>-1 && plan.value !== payPlan.vip) {
    confirm('无捐赠用户无法创建非TCP隧道', null, {
      confirmButtonText: '去捐赠',
      cancelButtonText: '知道了',
      confirmButtonClass: 'el-button--warning is-plain'
    }).then(() => {
      router.push({name: 'Plan'})
    }).catch(() => {
      formData.type = serviceType.TCP
    })
  } else {
    if(value === serviceType.TCP||value===serviceType.UDP){
      queryRangeByType()
      queryFreePort()
    }
    if(value === serviceType.STCP_CLIENT){
      formData.host=defaultHost
    }
    resetFormValidate(ruleFormRef,validateRes)
  }
}

function queryRangeByType() {
  queryRange(selectedServer.id, formData.type).then(res => {
    if (res.success) {
      portRange.value = res.data.records.map(c => {
        return `${c.min_port}-${c.max_port}`
      }).join(',')
    }
  })
}

function queryFreePort(){
  getFreePort(selectedServer.id, formData.type).then(res=>{
    if (res.success) {
      formData.remote_port = res.data
    }
  })
}

function queryRandomName(){
  getRandomSubName(selectedServer.id).then(res => {
    if(res.success){
      formData.name = res.data
      ruleFormRef.value.validateField('name')
    }
  })
}

function created() {
  queryRangeByType()
}

created()
</script>

<template>
  <TransitionGroup tag="ul" v-show="errorMsg.length>0" name="fade" class="error-msg">
    <li v-for="item in errorMsg" :key="item">
      {{ item }}
    </li>
  </TransitionGroup>
  <StaticFormContent ref="ruleFormRef"
              :formData="formData"
              :validateRes="validateRes"
              :portRange="portRange"
              @changeType="onChangeType"
              @queryRandomName="queryRandomName"
              @queryFreePort="queryFreePort"
  >
  </StaticFormContent>
  <div class="form-btns">
    <el-button type="success" plain :disabled="addBtnDisabled" :loading="saveLoading" @click="onSave">
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
.form-btns {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 60px;
}

.error-msg {
  white-space: pre-line;
  margin: 12px 0;
  padding: 12px 0;
  background: var(--el-color-warning-light-9);
  border-radius: 4px;
  color: var(--el-color-warning);
  list-style: disc inside;

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
