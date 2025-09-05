<script setup>
import {defineProps} from 'vue'
import {ElMessage} from "element-plus";
import {deleteTunnelServiceBatch, deleteTunnelWebBatch} from "@/api";
import {useAppStore} from '@/store'
import {confirm} from "@/libs/common";
import {checkPermission} from "@/libs/useAction";
import bus from '@/libs/bus'
import Search from '~icons/ep/search'

const props = defineProps(['type','tunnelConfigs'])
const emits = defineEmits(['deleteComplete','itemSelect'])
const store = useAppStore()
const {deleteIds,isDelete} = store
const activeId=ref(null)
const searchInput=ref(null)

provide('activeId', activeId);


bus.$on('tunnel:Item:click', (id)=>{
  activeId.value=id
  emits('change',id)
})

function onAddTunnel(type){
  if(checkPermission(type,props.tunnelConfigs)){
    store.setTunnelForm(null)
  }
}

function onEditTunnel(type,id){
  store.setTunnelForm(props.tunnelConfigs.find(c=>c.id===id))
}

function onDelTunnels(type){
  store.setIsDelete(type,!isDelete[type])
  store.setDeleteIds(type,[])
}

function onDelSelectChange(type,ids){
  store.setDeleteIds(type,ids)
}

function onConfirmDelTunnels(type){
  confirm('确定要删除所选的配置吗？', null,{
    confirmButtonClass:'el-button--danger is-plain'
  }).then(()=>{
    const deleteAction = {web:deleteTunnelWebBatch,service:deleteTunnelServiceBatch}[type]
    deleteAction(deleteIds[type].value.join(',')).then((res)=>{
      if(res.success){
        ElMessage.success('删除成功')
        emits('deleteComplete',type)
      }else{
        ElMessage.error('删除失败')
      }
    })
  })
}

</script>
<template>
  <div class="flex flex-col gap-12">
    <el-input v-model="searchInput" :prefix-icon="Search" class="rounded-4xl mb-12"></el-input>
    <slot></slot>
  </div>
</template>
<style scoped>

</style>
