<script setup lang="ts">

import {onMounted, shallowReactive, shallowRef} from "vue";
import {detailUser, orderQuery, userQuery} from "@/api";
import {useGetIndexMethod, usePage, useQuery, useQueryCallback} from "@/libs/use-curd";
import {showNotification, useFormatDateTime} from "@/libs/utils";
import {NotificationTypeEnum} from "@/libs/enum";
import {Search,RefreshLeft} from "@element-plus/icons-vue";

const loading = shallowRef(false)
const tableData = shallowReactive([] as any[])
const page = usePage()
const searchForm = shallowReactive({
  username:'',
  status:1,
  is_delete:0
})

function queryData(params: any): Promise<ResultType<PaginationDataType>> {
  loading.value = true
  return orderQuery(params).then(res => {
    loading.value=false
    return res
  })
}

function handleQuery(pageNumber:number=1,pageSize:number=20){
  page.pageNumber = pageNumber
  page.pageSize = pageSize
  useQuery(queryData,Object.assign({},page,searchForm),(res:ResultType<PaginationDataType>)=>{useQueryCallback(res,tableData,page)})
}
function handleReset(){
  Object.assign(searchForm,{
    username:'',
    status:1,
    is_delete:0
  })
  handleQuery(1,20)
}

function onDetailUser(id:string,status:number,is_delete:number){
  detailUser({
    id,
    status,
    is_delete
  }).then(res => {
    showNotification(res.success?NotificationTypeEnum.success:NotificationTypeEnum.error, res.success?"操作成功":"操作失败")
    res.success&&handleQuery(1,20)
  })
}

onMounted(()=>{
  handleQuery(1,20)
})
</script>

<template>
  <div class="w-full h-full flex flex-col gap-12">
    <div class="my-inner-form p-12 flex flex-row items-center bg-white border-1 border-(--el-border-color-light) rounded-2xl shadow-xs">
      <el-form inline>
        <el-form-item label="订单编号">
          <el-input v-model="searchForm.username"/>
        </el-form-item>
        <el-form-item label="创建日期">
          <el-select class="w-120!" v-model="searchForm.status">
            <el-option label="启用" :value="1"></el-option>
            <el-option label="禁用" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="支付状态">
          <el-select class="w-120!" v-model="searchForm.is_delete">
            <el-option label="已删" :value="1"></el-option>
            <el-option label="未删" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="()=>{handleQuery()}" :icon="Search">查询</el-button>
          <el-button @click="handleReset" :icon="RefreshLeft">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="flex-1 flex flex-col gap-12 border-1 border-(--el-border-color-light) bg-white rounded-2xl shadow-xs">
      <!--  表格  -->
      <div class="flex-1 w-full relative">
        <div class="absolute w-full h-full">
          <el-table v-loading="loading" :data="tableData" class="rounded-2xl!"  height="100%">
            <el-table-column fixed type="index" label="序号" align="center" :index="useGetIndexMethod" width="55"></el-table-column>
            <el-table-column prop="trade_no" label="订单号" align="left"></el-table-column>
            <el-table-column prop="role_name" label="支付状态" align="left"></el-table-column>
            <el-table-column prop="product" label="购买产品" align="left"></el-table-column>
            <el-table-column prop="pay_price" label="产品单价" align="left"></el-table-column>
            <el-table-column prop="pay_num" label="支付数量" align="left"></el-table-column>
            <el-table-column prop="pay_total_amount" label="支付金额" align="left"></el-table-column>
            <el-table-column prop="payed_time" label="支付时间" align="left">
              <template #default="{row}">
                {{useFormatDateTime(row.created_time)}}
              </template>
            </el-table-column>
            <el-table-column prop="is_delete" label="操作" align="left" width="80">
              <template #default="{row}">
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <!--  分页  -->
      <div class="flex justify-end px-12 pb-12">
        <el-pagination
            @size-change="(size:number)=>{handleQuery(1,size)}"
            @current-change="(current:number)=>{handleQuery(current,20)}"
            :current-page.sync="page.pageNumber"
            :page-size="page.pageSize"
            :page-sizes="page.pageSizes"
            :layout="page.layout"
            :total="page.total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">

</style>
