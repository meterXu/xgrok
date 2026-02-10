<script setup>
import {useAppStore} from '@/store'
import {payPlan} from "@/libs/enums";

const {plan} = useAppStore()
</script>

<template>
  <el-tag v-if="plan.value===payPlan.vip" plain type="success">福报绵绵</el-tag>
  <el-tag v-else plain type="info">萍水相逢</el-tag>
</template>

<style scoped lang="less">

</style>
