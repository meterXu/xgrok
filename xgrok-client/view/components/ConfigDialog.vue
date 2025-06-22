<script setup>
import {defineModel,watch,ref} from "vue";
import {queryServersConfig} from "@/api";
import {serverEnum} from "@/libs/enums";

const props=defineProps(['title','width'])
const model=defineModel()
const serverConfigs = ref(null)

watch(model,(nv)=>{
  if(nv){
    queryServersConfig(serverEnum.frp).then(res=>{
      if(res.success){
        // todo 先直接读取数据库中在线状态
        serverConfigs.value=res.data.records
      }
    })
  }
})
</script>

<template>
  <el-dialog v-model="model" :title="props.title" :width="props.width" align-center :destroy-on-close="true" class="my-dialog">
    <slot :serverConfigs="serverConfigs"></slot>
  </el-dialog>
</template>
