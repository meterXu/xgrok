<script setup lang="ts">

import {shallowReactive, shallowRef,onMounted} from "vue";
import {userQuery} from "@/api";
import {useGetIndexMethod,usePage,useQuery,useQueryCallback} from "@/libs/use-curd";
const loading = shallowRef(false)
const tableData = shallowReactive([] as any[])
const page = usePage()

function queryData(params: any): Promise<ResultType<PaginationDataType>> {
  loading.value = true
  return userQuery(params).then(res => {
    loading.value=false
    return res
  })
}

function handleCurrentChange(pageNumber:number){
  page.pageNumber = pageNumber
  useQuery(queryData,page,(res:ResultType<PaginationDataType>)=>{useQueryCallback(res,tableData,page)})
}

function handleSizeChange(pageSize:number){
  page.pageSize = pageSize
  useQuery(queryData,page,(res:ResultType<PaginationDataType>)=>{useQueryCallback(res,tableData,page)})
}

onMounted(()=>{
  useQuery(queryData,page,(res:ResultType<PaginationDataType>)=>{useQueryCallback(res,tableData,page)})
})
</script>

<template>
<div class="w-full h-full flex flex-col gap-12">
  <!--  表格  -->
  <div class="flex-1 w-full relative">
    <el-scrollbar class="absolute">
      <el-table v-loading="loading" :data="tableData" border height="100%">
        <el-table-column fixed type="index" label="序号" align="center" :index="useGetIndexMethod" width="45"></el-table-column>
        <el-table-column prop="username" label="用户名" align="left"></el-table-column>
        <el-table-column prop="role_name" label="所属角色" align="left"></el-table-column>
        <el-table-column prop="created_time" label="创建时间" align="left"></el-table-column>
        <el-table-column prop="status" label="是否启用" align="left" width="80"></el-table-column>
        <el-table-column prop="is_delete" label="是否删除" align="left" width="80"></el-table-column>
      </el-table>
    </el-scrollbar>
  </div>
  <!--  分页  -->
  <div class="flex justify-end">
    <el-pagination
        size="small"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="page.pageNumber"
        :page-size="page.pageSize"
        :page-sizes="page.pageSizes"
        :layout="page.layout"
        :total="page.total">
    </el-pagination>
  </div>
</div>
</template>

<style scoped lang="less">

</style>