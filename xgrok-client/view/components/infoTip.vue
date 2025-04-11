<script setup>
import {InfoFilled, Loading} from "@element-plus/icons-vue";
import {defineProps} from 'vue'
const {text} = defineProps(['text','loading'])

</script>

<template>
  <div class="info-tip-wrap">
    <el-icon v-if="loading" class="my-loading"><Loading></Loading></el-icon>
    <el-tooltip
        class="box-item"
        effect="light"
        raw-content
        placement="bottom"
        v-else
    >
      <template #content>
        <div class="tip-content" v-html="text"></div>
      </template>
      <el-icon class="el-input__icon"><InfoFilled /></el-icon>
    </el-tooltip>
  </div>
</template>

<style scoped>
.el-input__icon{
  color: var(--el-text-color-placeholder);
}
.info-tip-wrap{
  display: flex;
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;
}
.tip-content{
  max-width: 120px;
  color: var(--el-text-color-placeholder);
}
@keyframes revolve {
  from {
    transform: rotate(0deg); /* 起始状态 */
  }
  to {
    transform: rotate(360deg); /* 结束状态 */
  }
}
.my-loading{
  animation:revolve 1s linear infinite;
}
</style>