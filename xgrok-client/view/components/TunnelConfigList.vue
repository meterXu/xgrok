<script setup>
import {defineProps, defineEmits, ref, watch} from 'vue'
import {Edit} from "@element-plus/icons-vue";
import {useAppStore} from "@/store";

const props = defineProps(['tunnelList','isDelete','deleteIds'])
const emits = defineEmits(['delSelectChange','editTunnel'])
const ids = ref([])
const store = useAppStore()
const {pid,isCloseEdit} = store

watch(()=>props.isDelete,()=>{
  ids.value=[]
})

function onDelSelectChange(flag,id){
  if(flag){
    ids.value.push(id)
  }else{
    let findIndex = ids.value.findIndex(c=>c===id)
    ids.value.splice(findIndex,1)
  }
  emits('delSelectChange',ids.value)
}

function onEditTunnel(id){
  !isCloseEdit.value&&emits('editTunnel',id)
}
</script>

<template>
  <el-empty v-if="tunnelList===null||tunnelList.length===0" description="请添加配置" />
  <ul v-else class="grid grid-cols-2 gap-12 mt-12!">
    <li class="relative" v-for="item in tunnelList" :key="item.id">
      <div class="icon-control text-[16px]">
        <el-icon @click="onEditTunnel(item.id)" class="edit-icon"
                 :disabled="isCloseEdit"><Edit/></el-icon>
        <el-checkbox v-if="isDelete"
                     size="large"
                     class="del-checkbox"
                     :model-value="deleteIds?.value?.some(c=>c===item.id)"
                     @change="(flag)=>{onDelSelectChange(flag,item.id)}"></el-checkbox>
      </div>
     <slot :tunnelConfig="item"></slot>
    </li>
  </ul>
</template>

<style lang="less" scoped>
.icon-control{
  position: absolute;
  right: 8px;
  top: 0;
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  grid-gap: 8px;
  height: 40px;
}
.edit-icon{
  cursor: pointer;
  color: var(--edit-icon-color);
  &:hover{
    color: var(--el-color-success);
  }
  &[disabled='true']{
    cursor: not-allowed;
    color: var(--el-text-color-disabled);
  }
}
</style>