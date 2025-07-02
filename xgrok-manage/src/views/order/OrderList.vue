<script setup lang="ts">

import {onMounted, reactive, shallowReactive, shallowRef} from "vue";
import {detailUser, getDict, orderQuery} from "@/api";
import {useGetIndexMethod, usePage, useQuery, useQueryCallback} from "@/libs/use-curd";
import {mappingDic, resetObj, showNotification, useFormatDateTime, useFormatDic} from "@/libs/utils";
import {NotificationTypeEnum} from "@/libs/enum";
import {Search, RefreshLeft} from "@element-plus/icons-vue";

const loading = shallowRef(false)
const tableData = shallowReactive([] as any[])
const page = usePage()
const searchForm = reactive({
  trade_no: '',
  username: '',
  created_time: [],
  pay_status: null
})
const payStatus = shallowReactive<DictItemType[]>([])

function queryData(params: any): Promise<ResultType<PaginationDataType>> {
  loading.value = true
  return orderQuery(params).then(res => {
    loading.value = false
    return res
  })
}

function handleQuery(pageNumber: number = 1, pageSize: number = 20) {
  page.pageNumber = pageNumber
  page.pageSize = pageSize
  useQuery(queryData, Object.assign({}, page, searchForm,{
    created_time_start: searchForm.created_time[0],
    created_time_end:searchForm.created_time[1],
  }), (res: ResultType<PaginationDataType>) => {
    useQueryCallback(res, tableData, page)
  })
}

function handleReset() {
  resetObj(searchForm)
  handleQuery(1, 20)
}

function onDetailUser(id: string, status: number, is_delete: number) {
  detailUser({
    id,
    status,
    is_delete
  }).then(res => {
    showNotification(res.success ? NotificationTypeEnum.success : NotificationTypeEnum.error, res.success ? "操作成功" : "操作失败")
    res.success && handleQuery(1, 20)
  })
}

onMounted(() => {
  mappingDic([getDict('pay_status')], [
    payStatus
  ])
  handleQuery(1, 20)
})
</script>

<template>
  <div class="w-full h-full flex flex-col gap-12">
    <div
        class="my-inner-form p-12 flex flex-row items-center bg-white border-1 border-(--el-border-color-light) rounded-2xl shadow-xs">
      <el-form inline>
        <el-form-item label="订单编号">
          <el-input class="w-150!" v-model="searchForm.trade_no" clearable/>
        </el-form-item>
        <el-form-item label="创建日期">
          <el-date-picker class="w-260!" type="daterange"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期" :default-time="[
                              new Date(2000, 1, 1, 0, 0, 0),
                              new Date(2000, 2, 1, 23, 59, 59),]"
                          v-model="searchForm.created_time"></el-date-picker>
        </el-form-item>
        <el-form-item label="支付状态">
          <el-select class="w-150!" v-model="searchForm.pay_status" clearable>
            <el-option v-for="item in payStatus" :key="item.code" :label="item.chn_value"
                       :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="购买人">
          <el-input class="w-120!" v-model="searchForm.username" clearable>
          </el-input>
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
          <el-table v-loading="loading" :data="tableData" class="rounded-2xl!" height="100%">
            <el-table-column fixed type="index" label="序号" align="center" :index="useGetIndexMethod"
                             width="55"></el-table-column>
            <el-table-column prop="trade_no" label="订单号" align="left"></el-table-column>
            <el-table-column prop="name" label="购买产品" align="left"></el-table-column>
            <el-table-column prop="username" label="购买人" align="left"></el-table-column>
            <el-table-column prop="pay_status" label="支付状态" align="left">
              <template #default="{row}">
                <el-tag type="primary" v-if="row.pay_status===0">
                  {{ useFormatDic(payStatus, row.pay_status.toString()) }}
                </el-tag>
                <el-tag type="success" v-else-if="row.pay_status===1||row.pay_status===4">
                  {{ useFormatDic(payStatus, row.pay_status.toString()) }}
                </el-tag>
                <el-tag type="danger" v-else-if="row.pay_status===2">
                  {{ useFormatDic(payStatus, row.pay_status.toString()) }}
                </el-tag>
                <el-tag type="warning" v-else-if="row.pay_status===3">
                  {{ useFormatDic(payStatus, row.pay_status.toString()) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="pay_price" label="产品单价" align="left">
              <template #default="{row}">
                ¥{{ row.pay_price }}
              </template>
            </el-table-column>
            <el-table-column prop="pay_num" label="支付数量" align="left">
              <template #default="{row}">
                <el-tag type="primary">
                  {{ row.pay_num }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="pay_total_amount" label="支付金额" align="left">
              <template #default="{row}">
                ¥{{ row.pay_total_amount }}
              </template>
            </el-table-column>
            <el-table-column prop="created_time" label="创建时间" align="left">
              <template #default="{row}">
                {{ useFormatDateTime(row.created_time) }}
              </template>
            </el-table-column>
            <el-table-column prop="payed_time" label="支付时间" align="left">
              <template #default="{row}">
                {{ useFormatDateTime(row.payed_time) }}
              </template>
            </el-table-column>
            <el-table-column prop="refund_time" label="退款时间" align="left">
              <template #default="{row}">
                {{ useFormatDateTime(row.refund_time) }}
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
