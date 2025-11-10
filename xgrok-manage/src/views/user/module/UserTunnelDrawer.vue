<script setup lang="ts">
import {useGetIndexMethod, usePage} from "@/libs/use-curd";
import FillHeightContainer from "@/components/FillHeightContainer.vue";
import {onMounted, reactive, shallowReactive, watch,ref} from "vue";
import {getDict, queryTunnelWebConfig, tunnelServiceConfig} from "@/api";
import {mappingDic, useFormatDic} from "@/libs/utils";
import DrawerSubTitle from "@/components/DrawerSubTitle.vue";

const isVisible = defineModel()
const props = defineProps<{
  user:UserType
}>()
const tunnelWebConfigData = reactive([] as any[])
const tunnelServiceConfigData = reactive([] as any[])
const tunnelWebPage = usePage()
const tunnelServicePage = usePage()
const serviceTypeDict = shallowReactive<DictItemType[]>([])
const hostTypeDict = shallowReactive<DictItemType[]>([])
const tunnelWebLoading = ref(false)
const tunnelServiceLoading = ref(false)

watch(() => isVisible.value, (nv) => {
  if(nv){
    onQueryTunnelWebConfig()
    onTunnelServiceConfig()
  }
})

function onQueryTunnelWebConfig(pageNumber:number=1,pageSize:number=20){
  tunnelWebPage.pageNumber = pageNumber
  tunnelWebPage.pageSize = pageSize
  tunnelWebLoading.value = true
  queryTunnelWebConfig({userId: props.user.id,...tunnelWebPage}).then((res) => {
    if(res.success&&res.data){
      tunnelWebConfigData.splice(0,tunnelWebConfigData.length);
      tunnelWebConfigData.push(...res.data.records as any []);
      tunnelWebPage.total = res.data.total;
    }
  }).finally(() => {
    tunnelWebLoading.value = false
  })
}

function onTunnelServiceConfig(pageNumber:number=1,pageSize:number=20){
  tunnelServicePage.pageNumber = pageNumber
  tunnelServicePage.pageSize = pageSize
  tunnelServiceLoading.value = true
  tunnelServiceConfig({userId: props.user.id,...tunnelServicePage}).then((res) => {
    if(res.success&&res.data){
      tunnelServiceConfigData.splice(0,tunnelServiceConfigData.length);
      tunnelServiceConfigData.push(...res.data.records as any []);
      tunnelServicePage.total = res.data.total;
    }
  }).finally(() => {
    tunnelServiceLoading.value = false
  })
}

function getUrl(row:any){
  return [
      `http://${row.name}.${row.domain}:${row.http_port}`,
      `https://${row.name}.${row.domain}:${row.https_port}`
  ]
}

onMounted(()=>{
  mappingDic([
        getDict('service_type'),
        getDict('host_type')],
      [serviceTypeDict,hostTypeDict])
})
</script>

<template>
  <el-drawer v-model="isVisible" direction="rtl" size="40%" header-class="mb-0! p-20!" body-class="p-20!">
    <template #header>
      <h2 class="text-[14px] font-bold">用户【{{user.username}}】的隧道配置</h2>
    </template>
    <template #default>
      <div class="w-full h-full flex flex-col justify-items-start items-start gap-8 text-[14px] ">
        <div class="flex-1/2 flex flex-col justify-items-start items-start gap-8 w-full">
          <DrawerSubTitle :loading="tunnelWebLoading"
                                 @click="()=>{onQueryTunnelWebConfig(tunnelWebPage.pageNumber,tunnelWebPage.pageSize)}">
            WEB配置
          </DrawerSubTitle>
          <FillHeightContainer>
            <el-table class="rounded-2xl!" height="100%" width="100%" header-row-class-name="table-header" row-key="id"
                      :load="tunnelWebLoading"
                      :data="tunnelWebConfigData">
              <el-table-column fixed type="index" label="序号" align="center" :index="useGetIndexMethod" width="55"></el-table-column>
              <el-table-column prop="name" label="名称" show-overflow-tooltip align="left"></el-table-column>
              <el-table-column prop="hostname" show-overflow-tooltip width="100" label="设备名称" align="left"></el-table-column>
              <el-table-column prop="server_name" width="60" label="服务器" align="left"></el-table-column>
              <el-table-column show-overflow-tooltip label="HTTP连接" width="220" align="left">
                <template #default="{row}">
                  <el-link type="primary" :href="getUrl(row)[0]" target="_blank">{{getUrl(row)[0]}}</el-link>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip label="HTTPS连接" width="220" align="left">
                <template #default="{row}">
                  <el-link type="primary" :href="getUrl(row)[1]" target="_blank">{{getUrl(row)[1]}}</el-link>
                </template>
              </el-table-column>
              <el-table-column prop="host" show-overflow-tooltip label="代理网址" width="150" align="left"></el-table-column>
              <el-table-column prop="type" label="代理类型" align="left">
                <template #default="{row}">
                  {{useFormatDic(hostTypeDict,row.type.toString())}}
                </template>
              </el-table-column>
              <el-table-column prop="remark" label="备注" show-overflow-tooltip align="left"></el-table-column>
            </el-table>
          </FillHeightContainer>
          <div class="flex justify-end px-12 pb-12">
            <el-pagination
                @size-change="(size:number)=>{onQueryTunnelWebConfig(1,size)}"
                @current-change="(current:number)=>{onQueryTunnelWebConfig(current,20)}"
                :current-page.sync="tunnelWebPage.pageNumber"
                :page-size="tunnelWebPage.pageSize"
                :page-sizes="tunnelWebPage.pageSizes"
                :layout="tunnelWebPage.layout"
                :total="tunnelWebPage.total">
            </el-pagination>
          </div>
        </div>
        <div class="flex-1/2 flex flex-col justify-items-start items-start gap-8 w-full">
          <DrawerSubTitle :loading="tunnelServiceLoading"
                                 @click="()=>{onTunnelServiceConfig(tunnelServicePage.pageNumber,tunnelServicePage.pageSize)}">
            服务配置
          </DrawerSubTitle>
          <FillHeightContainer>
            <el-table class="rounded-2xl!" height="100%" header-row-class-name="table-header" row-key="id"
                      :load="tunnelServiceLoading"
                      :data="tunnelServiceConfigData">
              <el-table-column fixed type="index" label="序号" align="center" :index="useGetIndexMethod" width="55"></el-table-column>
              <el-table-column prop="name" label="名称" show-overflow-tooltip align="left"></el-table-column>
              <el-table-column prop="hostname" show-overflow-tooltip width="100" label="设备名称" align="left"></el-table-column>
              <el-table-column prop="server_name" width="60" label="服务器" align="left"></el-table-column>
              <el-table-column label="映射地址" show-overflow-tooltip width="160" align="left">
                <template #default="{row}">
                  <el-link type="primary">{{row.domain}}:{{row.remote_port}}</el-link>
                </template>
              </el-table-column>
              <el-table-column label="代理地址" show-overflow-tooltip width="160" align="left">
                <template #default="{row}">
                  {{row.host}}:{{row.port}}
                </template>
              </el-table-column>
              <el-table-column prop="type" label="代理类型" align="left">
                <template #default="{row}">
                  {{useFormatDic(serviceTypeDict,row.type.toString())}}
                </template>
              </el-table-column>
              <el-table-column prop="remark" label="备注" show-overflow-tooltip align="left"></el-table-column>
            </el-table>
          </FillHeightContainer>
          <div class="flex justify-end px-12 pb-12">
            <el-pagination
                @size-change="(size:number)=>{onTunnelServiceConfig(1,size)}"
                @current-change="(current:number)=>{onTunnelServiceConfig(current,20)}"
                :current-page.sync="tunnelServicePage.pageNumber"
                :page-size="tunnelServicePage.pageSize"
                :page-sizes="tunnelServicePage.pageSizes"
                :layout="tunnelServicePage.layout"
                :total="tunnelServicePage.total">
            </el-pagination>
          </div>
        </div>
      </div>
    </template>
  </el-drawer>
</template>

<style scoped lang="less">

</style>
