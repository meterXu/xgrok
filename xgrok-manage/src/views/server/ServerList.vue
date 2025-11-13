<script setup lang="ts">

import {onMounted, ref, shallowReactive, shallowRef, useTemplateRef} from "vue";
import {batchDelServer, detailServer, getDict, serverQuery} from "@/api";
import {useGetIndexMethod, usePage, useQuery, useQueryCallback} from "@/libs/use-curd";
import {mappingDic, resetObj, useBatchDelConfirm, useDel, useFormatDic} from "@/libs/utils";
import {showNotification} from "@/libs/utils/message";
import ServerEdit from "@/views/server/module/ServerEdit.vue";
import {IsDeleteEnum, NotificationTypeEnum, StatusEnum} from "@/libs/enum";
import {Search, RefreshLeft, Plus, Delete} from "@element-plus/icons-vue";
import type {TableInstance} from "element-plus";
import ServerPortDrawer from "./module/ServerPortDrawer.vue";

const loading = shallowRef(false)
const tableData = shallowReactive<any[]>([])
const page = usePage()
const searchForm = shallowReactive({
  name: null,
  type: null,
  status: StatusEnum.enable,
  is_delete: IsDeleteEnum.false
})
const serverTypeDict = shallowReactive<DictItemType[]>([])
const statusDict = shallowReactive<DictItemType[]>([])
const isDeleteDict = shallowReactive<DictItemType[]>([])
const formData = shallowReactive<Partial<ServerType>>({})
const dialogVisible = ref(false)
const portRangeVisible = ref(false)
const multipleSelection = ref<string[]>([])
const tableRef = useTemplateRef<TableInstance>('tableRef')

function queryData(params: any): Promise<ResultType<PaginationDataType<ServerType>>> {
  loading.value = true
  return serverQuery(params).then(res => {
    loading.value = false
    return res
  })
}

function handleQuery(pageNumber: number = 1, pageSize: number = 20) {
  page.pageNumber = pageNumber
  page.pageSize = pageSize
  useQuery(queryData, Object.assign({
    orderBy: JSON.stringify([{type: 'asc'},{created_time:'desc'}])
  }, page, searchForm), (res: ResultType<PaginationDataType<ServerType>>) => {
    tableRef.value?.clearSelection()
    useQueryCallback(res, tableData, page)
  })
}

function handleReset() {
  resetObj(searchForm, {status: StatusEnum.enable, is_delete:IsDeleteEnum.false})
  handleQuery(1, 20)
}

function onDetailServer(id: string, status: number, is_delete: number, is_vip: number) {
  detailServer({
    id,
    status,
    is_delete,
    is_vip
  }).then(res => {
    showNotification(res.success ? NotificationTypeEnum.success : NotificationTypeEnum.error, res.success ? "操作成功" : "操作失败")
    res.success && handleQuery(page.pageNumber, page.pageSize)
  })
}

function onConfigProt(row: ServerType) {
  Object.assign(formData,row)
  portRangeVisible.value = true
}

function onAdd() {
  resetObj(formData, {
    name:'',
    port: 4446,
    http_port:80,
    https_port:443,
    up_speed:'',
    down_speed:'',
    is_vip:1,
    is_online:1,
    has_ssl:1,
    status:StatusEnum.enable,
    is_delete:IsDeleteEnum.false
  })
  dialogVisible.value = true
}

function onDelete() {
  useBatchDelConfirm(multipleSelection.value, {}, () => batchDelServer(multipleSelection.value)).then(res => {
    useDel(res).then(() => {
      handleQuery()
    })
  })
}

function onSelectionChange(val: OrderType[]) {
  multipleSelection.value = val.map(c => c.id)
}

function onEdit(row:any){
  Object.assign(formData,row)
  dialogVisible.value = true
}

onMounted(() => {
  mappingDic(
      [getDict('server_type'), getDict('status'), getDict('is_delete')],
      [serverTypeDict, statusDict, isDeleteDict])
  handleQuery(1, 20)
})
</script>

<template>
  <div class="w-full h-full flex flex-col gap-12">
    <div
        class="my-inner-form p-12 flex flex-row items-center bg-white border-1 border-(--el-border-color-light) rounded-2xl shadow-xs">
      <el-form inline>
        <el-form-item label="名称">
          <el-input v-model="searchForm.name" clearable @keydown.enter="()=>{handleQuery()}"/>
        </el-form-item>
        <el-form-item label="类型">
          <el-select class="w-120!" v-model="searchForm.type" clearable @change="()=>{handleQuery()}">
            <el-option v-for="item in serverTypeDict" :label="item.chn_value" :value="parseInt(item.code)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否启用">
          <el-select class="w-120!" v-model="searchForm.status" clearable @change="()=>{handleQuery()}">
            <el-option v-for="item in statusDict" :label="item.chn_value" :value="parseInt(item.code)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否删除">
          <el-select class="w-120!" v-model="searchForm.is_delete" clearable @change="()=>{handleQuery()}">
            <el-option v-for="item in isDeleteDict" :label="item.chn_value" :value="parseInt(item.code)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="()=>{handleQuery()}" :icon="Search">查询</el-button>
          <el-button @click="handleReset" :icon="RefreshLeft">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="flex-1 flex flex-col gap-12 border-1 border-(--el-border-color-light) bg-white rounded-2xl shadow-xs">
      <div class="px-12 pt-12 rounded-2xl flex flex-row items-center bg-white">
        <el-button type="primary" :icon="Plus" @click="onAdd">添加</el-button>
        <el-button type="danger" :icon="Delete" @click="onDelete">删除</el-button>
      </div>
      <!--  表格  -->
      <div class="flex-1 w-full relative">
        <div class="absolute w-full h-full">
          <el-table ref="tableRef" v-loading="loading" :data="tableData"
                    header-row-class-name="table-header"
                    row-key="id" height="100%"
                    @selection-change="onSelectionChange">
            <el-table-column fixed type="selection"/>
            <el-table-column fixed type="index" label="序号" align="center" :index="useGetIndexMethod"
                             width="55"></el-table-column>
            <el-table-column prop="name" label="名称" align="left"></el-table-column>
            <el-table-column prop="domain" label="域名" align="left"></el-table-column>
            <el-table-column prop="port" label="端口" align="left"></el-table-column>
            <el-table-column prop="type" label="类型" align="left">
              <template #default="{row}">
                {{ useFormatDic(serverTypeDict, row.type.toString()) }}
              </template>
            </el-table-column>
            <el-table-column prop="http_port" label="HTTP端口" align="left"></el-table-column>
            <el-table-column prop="https_port" label="HTTPS端口" align="left"></el-table-column>
            <el-table-column prop="up_speed" label="上行速度" align="left"></el-table-column>
            <el-table-column prop="down_speed" label="下行速度" align="left"></el-table-column>
            <el-table-column prop="status" label="是否启用" align="left" width="100">
              <template #default="{row}">
                <el-switch v-model="row.status" :inactive-value="0" :active-value="1"
                           @change="(value:number)=>{onDetailServer(row.id,value,row.is_delete,row.is_vip)}"></el-switch>
              </template>
            </el-table-column>
            <el-table-column prop="is_delete" label="是否删除" align="left" width="100">
              <template #default="{row}">
                <el-switch v-model="row.is_delete" :inactive-value="0" :active-value="1"
                           style="--el-switch-on-color: var(--el-color-danger);"
                           @change="(value:number)=>{onDetailServer(row.id,row.status,value,row.is_vip)}"></el-switch>
              </template>
            </el-table-column>
            <el-table-column prop="is_vip" label="付费使用" align="left" width="100">
              <template #default="{row}">
                <el-switch v-model="row.is_vip" :inactive-value="0" :active-value="1"
                           @change="(value:number)=>{onDetailServer(row.id,row.status,row.is_delete,value)}"></el-switch>
              </template>
            </el-table-column>
            <el-table-column prop="id" label="操作" align="center" width="100">
              <template #default="{row}">
                <el-button type="text" @click="onEdit(row)">编辑</el-button>
                <el-button type="text" @click="onConfigProt(row)">端口配置</el-button>
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
  <ServerEdit v-model="dialogVisible" :formData="formData" @close="handleQuery"></ServerEdit>
  <ServerPortDrawer v-model="portRangeVisible" :server="formData"></ServerPortDrawer>
</template>

<style scoped lang="less">

</style>
