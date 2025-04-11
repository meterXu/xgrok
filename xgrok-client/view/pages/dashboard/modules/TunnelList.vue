<script setup>
import {defineProps} from 'vue'
import ConfigControlBtns from "@/components/ConfigControlBtns.vue";
import TunnelConfigList from "@/components/TunnelConfigList.vue";
import {ElMessage, ElMessageBox} from "element-plus";
import {deleteTunnelServiceBatch, deleteTunnelWebBatch} from "@/api";
import {useAppStore} from '@/store'
import {confirm} from "@/libs/common";
const props = defineProps(['type','tunnelConfigs'])
const emits = defineEmits(['deleteComplete'])
const store = useAppStore()
const {deleteIds,isDelete,selectedServer} = store

function onAddTunnel(type){
  store.setTunnelForm(null)
  store.setDialogVisible(type,true)
}

function onEditTunnel(type,id){
  store.setTunnelForm(props.tunnelConfigs.find(c=>c.id===id))
  store.setDialogVisible(type,true)
}

function onDelTunnels(type){
  store.setIsDelete(type,!isDelete[type])
  store.setDeleteIds(type,[])
}

function onDelSelectChange(type,ids){
  store.setDeleteIds(type,ids)
}

function onConfirmDelTunnels(type){
  confirm('确定要删除所选的配置吗？', '警告',{
    confirmButtonClass:'my-info-btn-danger'
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
  <ConfigControlBtns @addTunnel="onAddTunnel(type)"
                     @delTunnels="onDelTunnels(type)"
                     @cleanAll="()=>{onDelSelectChange(type,[])}"
                     @selectAll="()=>{onDelSelectChange(type,tunnelConfigs.map(c=>c.id))}"
                     @confirmDelTunnels="onConfirmDelTunnels(type)"
                     :isDelete="isDelete[type]"
                     :deleteIds="deleteIds[type]"
                     :allCount="tunnelConfigs?.length"
  ></ConfigControlBtns>
  <TunnelConfigList :tunnelList="tunnelConfigs"
                    :isDelete="isDelete[type]"
                    :deleteIds="deleteIds[type]"
                    @delSelectChange="(ids)=>{onDelSelectChange(type,ids)}"
                    @editTunnel="(id)=>{onEditTunnel(type,id)}">
    <template #default="{tunnelConfig}">
      <slot :tunnelConfig="tunnelConfig"></slot>
    </template>
  </TunnelConfigList>
</template>
<style scoped>

</style>