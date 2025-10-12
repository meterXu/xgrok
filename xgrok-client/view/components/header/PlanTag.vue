<script setup>
import {useAppStore} from '@/store'
import {payPlan} from "@/libs/enums";

const {plan} = useAppStore()
</script>

<template>
  <el-tag v-if="plan.value===payPlan.vip" plain type="success">付费计划</el-tag>
  <el-tag v-else plain type="info">免费计划</el-tag>
</template>

<style scoped lang="less">

</style>
