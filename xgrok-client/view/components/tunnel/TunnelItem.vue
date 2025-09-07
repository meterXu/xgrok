<script setup>
import bus from '@/libs/bus'
const props = defineProps(['id']);

const activeId = inject('activeId');
const initSelect = inject('initSelect');
function onClick(){
  bus.$emit('tunnel:Item:click',props.id);
}
onMounted(() => {
  if (!activeId.value&&initSelect) {
    bus.$emit('tunnel:Item:init-select',props.id);
  }
})
</script>

<template>
  <div @click="onClick" class="hover:bg-(--tunnel-item-bg) px-20 py-12 rounded-4xl overflow-hidden text-ellipsis cursor-pointer
  border-1 border-(--border-color) font-bold"
       :class="activeId&&props.id&&activeId===props.id?'bg-(--tunnel-item-bg) text-(--el-color-primary)!':''"
  >
    <slot/>
  </div>
</template>

<style scoped lang="less">

</style>
