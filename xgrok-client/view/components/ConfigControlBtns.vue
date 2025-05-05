<script setup>
import {computed, defineEmits, defineProps} from 'vue'
import {useAppStore} from "@/store";

const emits = defineEmits(['addTunnel','delTunnels','selectAll','cleanAll','confirmDelTunnels'])
const props = defineProps(['isDelete','deleteIds','allCount'])
const {pid,isCloseEdit}  = useAppStore()

const indeterminate = computed(()=>{
  return props.deleteIds.value.length>0&&props.deleteIds.value.length!==props.allCount
})
const checked = computed(()=>{
  return props.deleteIds.value.length>0&&props.deleteIds.value.length===props.allCount
})

function onAddTunnel(){
  emits('addTunnel')
}

function onDelTunnels(){
  if(props.deleteIds.value.length>0){
    emits('confirmDelTunnels')
  }else{
    emits('delTunnels')
  }
}

function onCheckChange(flag){
  flag?emits('selectAll'):emits('cleanAll')
}
</script>

<template>
  <div class="config-control-btns">
    <el-button-group class="my-info-btn-group">
      <el-button size="small" type="info" plain class="my-info-btn no-border" @click="onAddTunnel" :disabled="isCloseEdit">
        <template #icon>
          <i-ep-plus/>
        </template>
        添加</el-button>
      <el-button size="small" type="info" plain class="my-info-btn no-border"
                 :class="{'ready-delete':isDelete,'selected-delete':deleteIds.value.length>0}"
                 :disabled="isCloseEdit"
                 @click="onDelTunnels">
        <template #icon>
          <i-ep-minus/>
        </template>
        删除{{props.deleteIds.value.length>0?'('+props.deleteIds.value.length+')':''}}
      </el-button>
    </el-button-group>
    <el-checkbox v-if="isDelete" size="large" class="all-checkbox" :model-value="checked" :indeterminate="indeterminate" @change="onCheckChange"></el-checkbox>
  </div>
</template>

<style scoped>
.config-control-btns{
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.ready-delete{
  color: #fff;
  background-color:var(--el-color-danger-light-3)
}
.selected-delete{
  color: #fff;
  background-color:var(--el-color-danger)
}
.all-checkbox{
  height: 24px;
  margin-right: 8px;
}
</style>