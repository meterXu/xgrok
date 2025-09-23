<script setup>
import {onMounted} from "vue";
import {detailAssets} from "@/api";

const qq = ref('')
const wx = ref('')
onMounted(()=>{
  Promise.all([detailAssets('qq_group_qr'),detailAssets('wx_group_qr')]).then(resArray=>{
    qq.value = resArray[0].data?.path
    wx.value = resArray[1].data?.path
  })
})
</script>

<template>
  <div class="flex flex-row text-[24px] gap-8 cursor-pointer items-center">
    <el-popover>
      <img class="w-480" :src="qq" alt=""/>
      <template #reference>
        <MdiQqchat class="text-[20px]"/>
      </template>
    </el-popover>
    <el-popover>
      <img class="w-480" :src="wx" alt=""/>
      <template #reference>
        <MdiWechat/>
      </template>
    </el-popover>
  </div>
</template>

<style scoped lang="less">

</style>
