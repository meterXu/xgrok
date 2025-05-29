<script setup>
import {tipText} from "@/libs/infoText";
const props = defineProps(['loading'])
import {useAppStore} from '@/store'
const {pid} = useAppStore()
const router = useRouter()

const disabled = computed(()=>{
  return !Boolean(pid.value)||props.loading
})

function viewLog(){
  !disabled.value&&router.push({name:'Log'})
}
</script>

<template>
  <el-tooltip effect="light" :content="tipText.zh.viewLook" placement="bottom">
    <el-icon class="text-[16px]!"
             :class="disabled?'text-(--el-color-disabled)! cursor-not-allowed':'text-(--edit-icon-color)! hover:text-(--el-color-primary)!'">
      <i-ep-tickets @click="viewLog" />
    </el-icon>
  </el-tooltip>
</template>
<style scoped lang="less">
</style>