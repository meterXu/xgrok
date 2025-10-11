<script setup>
import bus from '@/libs/bus'
import Search from '~icons/ep/search'

const props = defineProps({
  initSelect:{
    type: Boolean,
    default: false
  }
})
const model = defineModel()
const searchInput = defineModel('search')
const emits = defineEmits(['input','change'])
const initSelectId = ref(null)

provide('activeId',model);
provide('initSelect',props.initSelect);


bus.$on('tunnel:Item:click', (id) => {
  model.value = id
  emits('change',id)
})

bus.$on('tunnel:Item:init-select', (id) => {
  if(!initSelectId.value) {
    initSelectId.value = id
    model.value = id
  }
})

</script>
<template>
  <div class="h-full w-full flex flex-col gap-24">
    <el-input v-model="searchInput" :prefix-icon="Search" class="rounded-4xl px-8" clearable></el-input>
    <slot></slot>
  </div>
</template>
<style scoped>

</style>
