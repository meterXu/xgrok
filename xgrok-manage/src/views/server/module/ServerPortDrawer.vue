<script setup lang="ts">
import {ref, reactive, watch, onMounted, shallowReactive} from 'vue'
import DrawerSubTitle from "@/components/DrawerSubTitle.vue";
import FillHeightContainer from "@/components/FillHeightContainer.vue";
import {useGetIndexMethod, usePage} from "@/libs/use-curd";
import {editPortRange, getDict, queryPortRange} from "@/api";
import {mappingDic, resetObj, useFormatDic} from "@/libs/utils";
import {IsDeleteEnum, NotificationTypeEnum} from "@/libs/enum";
import {showNotification} from "@/libs/utils/message.ts";
import {Plus} from '@element-plus/icons-vue'
import ServerPortDialog from "@/views/server/module/ServerPortDialog.vue";
const isVisible = defineModel()
const {server} = defineProps<{
  server:Partial<ServerType>
}>()
const portLoading  = ref(false)
const portRangeVisible = ref(false)
const serverPortData = reactive<any[]>([])
const serverPortPage = usePage()
const serviceTypeDict  = shallowReactive<DictItemType[]>([])
const statusDict = shallowReactive<DictItemType[]>([])
const formData = shallowReactive<Partial<PortRangeType>>({})

watch(isVisible, (nv) => {
  if(nv){
    onQueryServerPort()
  }
})

function onQueryServerPort(pageNumber:number=1,pageSize:number=20){
  serverPortPage.pageNumber = pageNumber
  serverPortPage.pageSize = pageSize
  portLoading.value = true
  queryPortRange({server_id: server.id,is_delete:IsDeleteEnum.false,...serverPortPage}).then((res) => {
    if(res.success&&res.data){
      serverPortData.splice(0,serverPortData.length);
      serverPortData.push(...res.data.records as any []);
      serverPortPage.total = res.data.total;
    }
  }).finally(() => {
    portLoading.value = false
  })
}

function onDetailPortRange(id:string,status:number,is_delete:number){
  editPortRange({
    id,
    status,
    is_delete
  }).then(res => {
    showNotification(res.success ? NotificationTypeEnum.success : NotificationTypeEnum.error, res.success ? "操作成功" : "操作失败")
    res.success && onQueryServerPort(serverPortPage.pageNumber, serverPortPage.pageSize)
  })
}

function onAddPortRange(){
  resetObj(formData,{
    type:1,
    min_port:0,
    max_port:0,
    server_id:server.id
  })
  portRangeVisible.value=true
}

function onEdit(row:PortRangeType){
  resetObj(formData,row)
  portRangeVisible.value = true
}

onMounted(()=>{
  mappingDic([
        getDict('service_type'),
        getDict('status')],
      [serviceTypeDict,statusDict])
})

</script>

<template>
<el-drawer v-model="isVisible" direction="rtl" size="40%" header-class="mb-0! p-20!" body-class="p-20!">
  <template #header>
    <h2 class="text-[14px] font-bold">服务【{{server.name}}】的端口配置</h2>
  </template>
  <template #default>
    <div class="w-full h-full flex flex-col justify-items-start items-start gap-8 text-[14px] ">
      <div class="flex-1 flex flex-col justify-items-start items-start gap-8 w-full">
        <div class="w-full flex items-center justify-between">
          <DrawerSubTitle :loading="portLoading"
                          @click="()=>{onQueryServerPort(serverPortPage.pageNumber,serverPortPage.pageSize)}">
            端口配置
          </DrawerSubTitle>
          <el-button @click="onAddPortRange" type="default" text :icon="Plus">
            添加
          </el-button>
        </div>

        <FillHeightContainer>
          <el-table class="rounded-2xl!" height="100%" width="100%" header-row-class-name="table-header" row-key="id"
                    :load="portLoading"
                    :data="serverPortData">
            <el-table-column fixed type="index" label="序号" align="center" :index="useGetIndexMethod" width="55"></el-table-column>
            <el-table-column show-overflow-tooltip  prop="min_port" label="开始端口" align="left"></el-table-column>
            <el-table-column show-overflow-tooltip  prop="max_port" label="结束端口" align="left"></el-table-column>
            <el-table-column prop="type" width="60" label="类型" align="left">
              <template #default="{row}">
                <el-tag>{{useFormatDic(serviceTypeDict,row.type.toString())}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="是否启用" align="left" width="60">
              <template #default="{row}">
                <el-switch v-model="row.status" :inactive-value="0" :active-value="1"
                           @change="onDetailPortRange(row.id,row.status,row.is_delete)"></el-switch>
              </template>
            </el-table-column>
            <el-table-column prop="is_delete" label="是否删除" align="left" width="60">
              <template #default="{row}">
                <el-switch v-model="row.is_delete" :inactive-value="0" :active-value="1"
                           style="--el-switch-on-color: var(--el-color-danger);"
                           @change="onDetailPortRange(row.id,row.status,row.is_delete)"></el-switch>
              </template>
            </el-table-column>
            <el-table-column prop="id" label="操作" align="center" width="60">
              <template #default="{row}">
                <el-button type="text" @click="onEdit(row)">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
        </FillHeightContainer>
        <div class="flex justify-end px-12 pb-12">
          <el-pagination
              @size-change="(size:number)=>{onQueryServerPort(1,size)}"
              @current-change="(current:number)=>{onQueryServerPort(current,20)}"
              :current-page.sync="serverPortPage.pageNumber"
              :page-size="serverPortPage.pageSize"
              :page-sizes="serverPortPage.pageSizes"
              :layout="serverPortPage.layout"
              :total="serverPortPage.total">
          </el-pagination>
        </div>
      </div>
    </div>
  </template>
</el-drawer>
<ServerPortDialog v-model="portRangeVisible" :formData="formData" @close="onQueryServerPort"></ServerPortDialog>
</template>

<style scoped lang="less">

</style>