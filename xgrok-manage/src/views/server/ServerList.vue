<script setup lang="ts">

import {onMounted, shallowReactive, shallowRef} from "vue";
import {detailUser, getDict, serverQuery, userQuery} from "@/api";
import {useGetIndexMethod, usePage, useQuery, useQueryCallback} from "@/libs/use-curd";
import {mappingDic, resetObj, showNotification, useFormatDateTime, useFormatDic} from "@/libs/utils";
import {NotificationTypeEnum} from "@/libs/enum";
import {Search,RefreshLeft} from "@element-plus/icons-vue";

const loading = shallowRef(false)
const tableData = shallowReactive([] as any[])
const page = usePage()
const searchForm = shallowReactive({
  name:'',
  type:null,
  status:null,
  is_delete:null
})
const serverTypeDict = shallowReactive<DictItemType[]>([])
const statusDict = shallowReactive<DictItemType[]>([])
const isDeleteDict = shallowReactive<DictItemType[]>([])

function queryData(params: any):Promise<ResultType<PaginationDataType>> {
  loading.value = true
  return serverQuery(params).then(res => {
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
  resetObj(searchForm)
  handleQuery(1,20)
}

function onDetailUser(id:string,status:number,is_delete:number){
  detailUser({
    id,
    status,
    is_delete
  }).then(res => {
    showNotification(res.success?NotificationTypeEnum.success:NotificationTypeEnum.error, res.success?"操作成功":"操作失败")
    res.success&&handleQuery(page.pageNumber,page.pageSize)
  })
}

onMounted(()=>{
  mappingDic(
      [getDict('server_type'),getDict('status'),getDict('is_delete')],
      [serverTypeDict,statusDict,isDeleteDict])
  handleQuery(1,20)
})
</script>

<template>
  <div class="w-full h-full flex flex-col gap-12">
    <div class="my-inner-form p-12 flex flex-row items-center bg-white border-1 border-(--el-border-color-light) rounded-2xl shadow-xs">
      <el-form inline>
        <el-form-item label="名称">
          <el-input v-model="searchForm.name"/>
        </el-form-item>
        <el-form-item label="类型">
          <el-select class="w-120!" v-model="searchForm.type">
            <el-option v-for="item in serverTypeDict" :label="item.chn_value" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否启用">
          <el-select class="w-120!" v-model="searchForm.status" clearable>
            <el-option v-for="item in statusDict" :label="item.chn_value" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否删除">
          <el-select class="w-120!" v-model="searchForm.is_delete" clearable>
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
      <!--  表格  -->
      <div class="flex-1 w-full relative">
        <div class="absolute w-full h-full">
          <el-table v-loading="loading" :data="tableData" class="rounded-2xl!" height="100%">
            <el-table-column fixed type="index" label="序号" align="center" :index="useGetIndexMethod" width="55"></el-table-column>
            <el-table-column prop="name" label="名称" align="left"></el-table-column>
            <el-table-column prop="domain" label="域名" align="left"></el-table-column>
            <el-table-column prop="type" label="类型" align="left">
              <template #default="{row}">
                {{useFormatDic(serverTypeDict,row.type.toString())}}
              </template>
            </el-table-column>
            <el-table-column prop="http_port" label="HTTP端口" align="left"></el-table-column>
            <el-table-column prop="https_port" label="HTTPS端口" align="left"></el-table-column>
            <el-table-column prop="up_speed" label="上行速度" align="left"></el-table-column>
            <el-table-column prop="down_speed" label="下行速度" align="left"></el-table-column>
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
            <el-table-column prop="is_vip" label="付费使用" align="left" width="100">
              <template #default="{row}">
                <el-switch v-model="row.is_vip" :inactive-value="0" :active-value="1" @change="(value:number)=>{onDetailUser(row.id,value,row.is_delete)}"></el-switch>
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
