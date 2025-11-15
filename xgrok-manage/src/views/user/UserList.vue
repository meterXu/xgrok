<script setup lang="ts">

import {onMounted, ref, shallowReactive, shallowRef, useTemplateRef} from "vue";
import {batchDelUser, editUser, getDict, userQuery} from "@/api";
import {useGetIndexMethod, usePage, useQuery, useQueryCallback} from "@/libs/use-curd";
import {mappingDic, resetObj, useBatchDelConfirm, useDel, useFormatDateTime} from "@/libs/utils";
import {showNotification} from '@/libs/utils/message.ts'
import {IsDeleteEnum, NotificationTypeEnum, StatusEnum} from "@/libs/enum";
import {Search, RefreshLeft, Plus, Delete} from "@element-plus/icons-vue";
import UserEdit from "./module/UserEdit.vue";
import UserTunnelDrawer from "@/views/user/module/UserTunnelDrawer.vue";
import type {TableInstance} from "element-plus";

const loading = shallowRef(false)
const tableData = shallowReactive([] as any[])
const page = usePage()
const dialogVisible = ref(false)
const searchForm = shallowReactive({
  username:'',
  status:1,
  is_delete:0
})
const statusDict = shallowReactive<DictItemType[]>([])
const isDeleteDict = shallowReactive<DictItemType[]>([])
const formData = shallowReactive<UserType>({} as UserType)
const multipleSelection = ref<string[]>([])
const selectedUser = shallowReactive<UserType>({} as UserType)
const drawerVisible = ref(false)
const tableRef = useTemplateRef<TableInstance>('tableRef')

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
  useQuery(queryData,Object.assign({},page,searchForm),(res:ResultType<PaginationDataType<UserType>>)=>{
    tableRef.value?.clearSelection()
    useQueryCallback(res,tableData,page)})
}
function handleReset(){
  resetObj(searchForm,{status:1, is_delete:0})
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
  resetObj(formData,{status:StatusEnum.enable,is_delete:IsDeleteEnum.false})
  dialogVisible.value = true
}

function onDelete(){
  useBatchDelConfirm(multipleSelection.value,{},()=>batchDelUser(multipleSelection.value,false)).then(res=>{
    useDel(res).then(()=>{
      handleQuery()
    })
  })
}

function onPhysicsDelete(){
  useBatchDelConfirm(multipleSelection.value,{},()=>batchDelUser(multipleSelection.value,true)).then(res=>{
    useDel(res).then(()=>{
      handleQuery()
    })
  })
}

function onShowDrawer(user:UserType){
  Object.assign(selectedUser,user)
  drawerVisible.value = true
}

onMounted(()=>{
  mappingDic([getDict('status'),getDict('is_delete')],[statusDict,isDeleteDict])
  handleQuery(1,20)
})
</script>

<template>
<div class="w-full h-full flex flex-col gap-12 pb-4">
  <div class="my-inner-form p-12 flex flex-row items-center bg-white border-1 border-(--el-border-color-light) rounded-2xl shadow-xs">
    <el-form inline>
      <el-form-item label="用户名">
        <el-input v-model="searchForm.username" clearable @keydown.enter="()=>{handleQuery()}"/>
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
    <div class="px-12 pt-12 flex flex-row items-center rounded-2xl bg-white">
      <el-button type="primary" :icon="Plus" @click="onAdd">添加</el-button>
      <el-button type="danger" :icon="Delete" @click="onDelete">删除</el-button>
      <el-button type="danger" :icon="Delete" @click="onPhysicsDelete">物理删除</el-button>
    </div>
    <!--  表格  -->
    <div class="flex-1 w-full relative">
      <div class="absolute w-full h-full">
        <el-table ref="tableRef" v-loading="loading" :data="tableData"
                  class="rounded-2xl!"
                  height="100%"
                  header-row-class-name="table-header"
                  row-key="id"
                  @selection-change="onSelectionChange">
          <el-table-column fixed type="selection"/>
          <el-table-column fixed type="index" label="序号" align="center" :index="useGetIndexMethod" width="55"></el-table-column>
          <el-table-column fixed prop="username" label="用户名" width="200" show-overflow-tooltip align="left"></el-table-column>
          <el-table-column prop="nickname" label="昵称" width="160" show-overflow-tooltip align="left"></el-table-column>
          <el-table-column prop="role_name" label="所属角色" width="100" align="left"></el-table-column>
          <el-table-column prop="created_time" label="创建时间" align="left">
            <template #default="{row}">
              {{useFormatDateTime(row.created_time)}}
            </template>
          </el-table-column>
          <el-table-column label="隧道配置" align="left">
            <template #default="{row}">
              <span class="underline cursor-pointer text-(--el-color-blue) inline-block" @click="onShowDrawer(row)">WEB：{{row.web_count}}</span>
              <span class="underline cursor-pointer text-(--el-color-danger) inline-block ml-8" @click="onShowDrawer(row)">服务：{{row.service_count}}</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" prop="status" label="是否启用" width="100" align="left">
            <template #default="{row}">
              <el-switch v-model="row.status" :inactive-value="0" :active-value="1" @change="(value:number)=>{onDetailUser(row.id,value,row.is_delete)}"></el-switch>
            </template>
          </el-table-column>
          <el-table-column fixed="right" prop="is_delete" label="是否删除" width="100" align="left">
            <template #default="{row}">
              <el-switch v-model="row.is_delete" :inactive-value="0" :active-value="1"
                         style="--el-switch-on-color: var(--el-color-danger);" @change="(value:number)=>{onDetailUser(row.id,row.status,value)}"></el-switch>
            </template>
          </el-table-column>
          <el-table-column fixed="right" prop="is_delete" width="220" label="操作" align="center">
            <template #default="{row}">
              <el-button type="text" @click="onEdit(row)">编辑</el-button>
              <el-button type="text" @click="onEdit(row)">重置密码</el-button>
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
  <UserTunnelDrawer v-model="drawerVisible" :user="selectedUser"></UserTunnelDrawer>
</template>

<style scoped lang="less">

</style>
