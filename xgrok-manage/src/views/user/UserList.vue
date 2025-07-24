<script setup lang="ts">

import {onMounted, ref, shallowReactive, shallowRef} from "vue";
import {batchDelUser, editUser, getDict, userQuery} from "@/api";
import {useGetIndexMethod, usePage, useQuery, useQueryCallback} from "@/libs/use-curd";
import {mappingDic, resetObj, useBatchDelConfirm, useDel, useFormatDateTime} from "@/libs/utils";
import {showNotification} from '@/libs/utils/message.ts'
import {IsDeleteEnum, NotificationTypeEnum, StatusEnum} from "@/libs/enum";
import {Search, RefreshLeft, Plus, Delete} from "@element-plus/icons-vue";
import UserEdit from "./module/UserEdit.vue";

const loading = shallowRef(false)
const tableData = shallowReactive([] as any[])
const page = usePage()
const dialogVisible = ref(false)
const searchForm = shallowReactive({
  username:'',
  status:StatusEnum.enable.toString(),
  is_delete:IsDeleteEnum.false.toString()
})
const statusDict = shallowReactive<DictItemType[]>([])
const isDeleteDict = shallowReactive<DictItemType[]>([])
const formData = shallowReactive<UserType>({} as UserType)
const multipleSelection = ref<string[]>([])

function queryData(params: any): Promise<ResultType<PaginationDataType<UserType>>> {
  loading.value = true
  return userQuery(params).then(res => {
    loading.value=false
    return res
  })
}

function handleQuery(pageNumber:number=1,pageSize:number=20){
  page.pageNumber = pageNumber
  page.pageSize = pageSize
  useQuery(queryData,Object.assign({},page,searchForm),(res:ResultType<PaginationDataType<UserType>>)=>{useQueryCallback(res,tableData,page)})
}
function handleReset(){
  resetObj(searchForm,{
    status:StatusEnum.enable.toString(),
    is_delete:IsDeleteEnum.false.toString()
  })
  handleQuery(1,20)
}

function onDetailUser(id:string,status:number,is_delete:number){
  editUser({
    id,
    status,
    is_delete
  } as UserType).then(res => {
    showNotification(res.success?NotificationTypeEnum.success:NotificationTypeEnum.error, res.success?"操作成功":"操作失败")
    res.success&&handleQuery(page.pageNumber,page.pageSize)
  })
}

function onEdit(row:any){
  Object.assign(formData,row)
  dialogVisible.value = true
}

function onSelectionChange(val: OrderType[]){
  multipleSelection.value = val.map(c=>c.id)
}

function onAdd(){
  resetObj(formData)
  dialogVisible.value = true
}

function onDelete(){
  useBatchDelConfirm(multipleSelection.value,{},()=>batchDelUser(multipleSelection.value)).then(res=>{
    useDel(res).then(()=>{
      handleQuery()
    })
  })
}

onMounted(()=>{
  mappingDic([getDict('status'),getDict('is_delete')],[statusDict,isDeleteDict])
  handleQuery(1,20)
})
</script>

<template>
<div class="w-full h-full flex flex-col gap-12">
  <div class="my-inner-form p-12 flex flex-row items-center bg-white border-1 border-(--el-border-color-light) rounded-2xl shadow-xs">
    <el-form inline>
      <el-form-item label="用户名">
        <el-input v-model="searchForm.username" clearable/>
      </el-form-item>
      <el-form-item label="是否启用">
        <el-select class="w-120!" v-model="searchForm.status">
          <el-option v-for="item in statusDict" :label="item.chn_value" :value="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否删除">
        <el-select class="w-120!" v-model="searchForm.is_delete">
          <el-option v-for="item in isDeleteDict" :label="item.chn_value" :value="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="()=>{handleQuery()}" :icon="Search">查询</el-button>
        <el-button @click="handleReset" :icon="RefreshLeft">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
  <div class="flex-1 flex flex-col gap-12 border-1 border-(--el-border-color-light) bg-white rounded-2xl shadow-xs">
    <div class="px-12 pt-12 flex flex-row items-center bg-white">
      <el-button type="primary" :icon="Plus" @click="onAdd">添加</el-button>
      <el-button type="danger" :icon="Delete" @click="onDelete">删除</el-button>
    </div>
    <!--  表格  -->
    <div class="flex-1 w-full relative">
      <div class="absolute w-full h-full">
        <el-table v-loading="loading" :data="tableData" class="rounded-2xl!" height="100%" @selection-change="onSelectionChange">
          <el-table-column fixed type="selection" width="45" />
          <el-table-column fixed type="index" label="序号" align="center" :index="useGetIndexMethod" width="55"></el-table-column>
          <el-table-column prop="username" label="用户名" align="left"></el-table-column>
          <el-table-column prop="nickname" label="昵称" align="left"></el-table-column>
          <el-table-column prop="role_name" label="所属角色" align="left"></el-table-column>
          <el-table-column prop="created_time" label="创建时间" align="left">
            <template #default="{row}">
              {{useFormatDateTime(row.created_time)}}
            </template>
          </el-table-column>
          <el-table-column label="隧道配置" align="left" width="200">
            <template #default="{row}">
              <span class="underline cursor-pointer">WEB：{{row.web_count}}个，服务：{{row.service_count}}个</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="是否启用" align="left" width="100">
            <template #default="{row}">
              <el-switch v-model="row.status" :inactive-value="0" :active-value="1" @change="(value:number)=>{onDetailUser(row.id,value,row.is_delete)}"></el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="is_delete" label="是否删除" align="left" width="100">
            <template #default="{row}">
              <el-switch v-model="row.is_delete" :inactive-value="0" :active-value="1"
                         style="--el-switch-on-color: var(--el-color-danger);" @change="(value:number)=>{onDetailUser(row.id,row.status,value)}"></el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="is_delete" width="120" label="操作" align="center">
            <template #default="{row}">
              <el-button type="text" @click="onEdit(row)">编辑</el-button>
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
  <UserEdit v-model="dialogVisible" :formData="formData" @close="handleQuery"></UserEdit>
</template>

<style scoped lang="less">

</style>
