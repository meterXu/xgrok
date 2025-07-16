<script setup lang="ts">
import {reactive, computed, ref, watch, onMounted, shallowReactive} from 'vue'
import type {FormInstance} from 'element-plus'
import {mappingDic, useSaveOrUpdate} from "@/libs/utils/index.js";
import {addOrder, detailUser, editOrder, getDict, productQuery, userQuery} from "@/api";

interface Props {
  formData: OrderType
}

const props = defineProps<Props>()
const dialogVisible = defineModel()
const emit = defineEmits(['close'])
const ruleFormRef = ref<FormInstance>()
const rules = reactive({
  creator: [{required: true, message: '请选择购买人', trigger: 'blur'}],
  product_id:[{required: true, message: '请选择购买的产品', trigger: 'blur'}],
  pay_price:[{required: true, message: '请输入商品单价', trigger: 'blur'}],
  pay_num:[{required: true, message: '请输入购买数量', trigger: 'blur'}],
  pay_total_amount:[{required: true, message: '请输入商品总价', trigger: 'blur'}],
  pay_status: [{required: true, message: '请选择支付状态', trigger: 'blur'}],
  payed_time: [{required: true, message: '请选择支付时间', trigger: 'blur'}],
  refund_time: [{required: true, message: '请选择退款时间', trigger: 'blur'}],
  expired_time: [{required: true, message: '请选择过期时间', trigger: 'blur'}],
})
const payStatus = reactive<DictItemType[]>([])
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

function handleOk() {
  ruleFormRef.value?.validate(async valid => {
    if (valid) {
      saveLoading.value=true
      try {
        let res = props.formData.id?await editOrder(props.formData as OrderType):await addOrder(props.formData as OrderType)
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

function onProductSelect(value:string){
  const product = productList.find(c=>c.id===value)
  if (product) {
    props.formData.pay_price = product.price
  }
}

onMounted(() => {
  mappingDic([getDict('pay_status')], [payStatus])
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
      <el-form-item label="购买产品" prop="product_id">
        <el-col :span="21">
          <el-select v-model="formData.product_id" placeholder="请选择购买的产品" @change="onProductSelect">
            <el-option v-for="item in productList" :key="item.id" :label="item.name" :value="item.id" class="w-full!"></el-option>
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item label="商品单价" prop="pay_price">
        <el-col :span="21">
          <el-input-number v-model="formData.pay_price" placeholder="请输入商品单价"></el-input-number>
        </el-col>
      </el-form-item>
      <el-form-item label="购买数量" prop="pay_num">
        <el-col :span="21">
          <el-input-number v-model="formData.pay_num" placeholder="请输入购买数量"></el-input-number>
        </el-col>
      </el-form-item>
      <el-form-item label="购买人" prop="creator">
        <el-col :span="21">
          <el-select filterable remote reserve-keyword clearable v-model="formData.creator" placeholder="请选择购买人"
                     :remote-method="remoteMethod" :loading="searchUserLoading">
            <el-option
                v-for="item in userOptions"
                :key="item.id"
                :label="item.username"
                :value="item.id"
            />
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item label="支付时间" prop="payed_time">
        <el-col :span="21">
          <el-date-picker v-model="formData.payed_time" class="w-full!" type="datetime"
                          placeholder="请选择支付时间"></el-date-picker>
        </el-col>
      </el-form-item>
      <el-form-item label="支付状态" prop="pay_status">
        <el-col :span="21">
          <el-select v-model="formData.pay_status" placeholder="请选择支付状态">
            <el-option v-for="item in payStatus" :key="item.code" :value="parseInt(item.code)"
                       :label="item.chn_value"></el-option>
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item v-if="formData.pay_status === 3" label="退款时间" prop="refund_time">
        <el-col :span="21">
          <el-date-picker v-model="formData.refund_time" type="datetime" class="w-full!"
                          placeholder="请选择退款时间"></el-date-picker>
        </el-col>
      </el-form-item>
      <el-form-item label="过期时间" prop="expired_time">
        <el-col :span="21">
          <el-date-picker v-model="formData.expired_time" type="datetime" class="w-full!"
                          placeholder="请选择过期时间"></el-date-picker>
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