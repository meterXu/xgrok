<script setup lang="ts">
import {useGetIndexMethod, usePage} from "@/libs/use-curd";
import FillHeightContainer from "@/components/FillHeightContainer.vue";
import {onMounted, reactive, shallowReactive, watch} from "vue";
import {getDict, queryTunnelWebConfig, tunnelServiceConfig} from "@/api";
import {mappingDic, useFormatDic} from "@/libs/utils";

const isVisible = defineModel()
const props = defineProps(['user'])
const tunnelWebConfigData = reactive([] as any[])
const tunnelServiceConfigData = reactive([] as any[])
const tunnelWebPage = usePage()
const tunnelServicePage = usePage()
const statusDict = shallowReactive<DictItemType[]>([])
const isDeleteDict = shallowReactive<DictItemType[]>([])
const serviceTypeDict = shallowReactive<DictItemType[]>([])
const hostTypeDict = shallowReactive<DictItemType[]>([])

watch(() => props.user.id, () => {
  onQueryTunnelWebConfig()
  onTunnelServiceConfig()
})

function onQueryTunnelWebConfig(){
  queryTunnelWebConfig({userId: props.user.id,...tunnelWebPage}).then((res) => {
    if(res.success&&res.data){
      tunnelWebConfigData.splice(0,tunnelWebConfigData.length);
      tunnelWebConfigData.push(...res.data.records as any []);
    }
  })
}

function onTunnelServiceConfig(){
  tunnelServiceConfig({userId: props.user.id,...tunnelServicePage}).then((res) => {
    if(res.success&&res.data){
      tunnelServiceConfigData.splice(0,tunnelServiceConfigData.length);
      tunnelServiceConfigData.push(...res.data.records as any []);
    }
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
        getDict('status'),
        getDict('is_delete'),
        getDict('service_type'),
        getDict('host_type')],
      [statusDict,isDeleteDict,serviceTypeDict,hostTypeDict])
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
          <h3 class="text-[14px]">
            WEB配置
          </h3>
          <FillHeightContainer>
            <el-table class="rounded-2xl!" height="100%" width="100%" header-row-class-name="table-header" row-key="id"
            :data="tunnelWebConfigData">
              <el-table-column fixed type="index" label="序号" align="center" :index="useGetIndexMethod" width="55"></el-table-column>
              <el-table-column prop="name" label="名称" align="left"></el-table-column>
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
              <el-table-column prop="remark" label="备注" align="left"></el-table-column>
              <el-table-column prop="status" label="状态" align="left">
                <template #default="{row}">
                  {{useFormatDic(statusDict,row.status.toString())}}
                </template>
              </el-table-column>
              <el-table-column prop="is_delete" label="是否删除" align="left">
                <template #default="{row}">
                  {{useFormatDic(isDeleteDict,row.is_delete.toString())}}
                </template>
              </el-table-column>
            </el-table>
          </FillHeightContainer>
        </div>
        <div class="flex-1/2 flex flex-col justify-items-start items-start gap-8 w-full">
          <h3 class="text-[14px]">
            服务配置
          </h3>
          <FillHeightContainer>
            <el-table class="rounded-2xl!" height="100%" header-row-class-name="table-header" row-key="id"
                      :data="tunnelServiceConfigData">
              <el-table-column fixed type="index" label="序号" align="center" :index="useGetIndexMethod" width="55"></el-table-column>
              <el-table-column prop="name" label="名称" align="left"></el-table-column>
              <el-table-column label="映射地址" show-overflow-tooltip width="160" align="left">
                <template #default="{row}">
                  <el-link type="primary">{{row.domain}}:{{row.remote_port}}</el-link>
                </template>
              </el-table-column>
              <el-table-column label="代理地址" show-overflow-tooltip width="150" align="left">
                <template #default="{row}">
                  {{row.host}}:{{row.port}}
                </template>
              </el-table-column>
              <el-table-column prop="type" label="代理类型" align="left">
                <template #default="{row}">
                  {{useFormatDic(serviceTypeDict,row.type.toString())}}
                </template>
              </el-table-column>
              <el-table-column prop="remark" label="备注" align="left"></el-table-column>
              <el-table-column prop="status" label="状态" align="left">
                <template #default="{row}">
                  {{useFormatDic(statusDict,row.status.toString())}}
                </template>
              </el-table-column>
              <el-table-column prop="is_delete" label="是否删除" align="left">
                <template #default="{row}">
                  {{useFormatDic(isDeleteDict,row.is_delete.toString())}}
                </template>
              </el-table-column>
            </el-table>
          </FillHeightContainer>
        </div>
      </div>
    </template>
  </el-drawer>
</template>

<style scoped lang="less">

</style>
