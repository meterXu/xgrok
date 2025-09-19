<script setup>
const epLoadingSpinner = `<path fill="currentColor" d="M512 64a32 32 0 0 1 32 32v192a32 32 0 0 1-64 0V96a32 32 0 0 1 32-32m0 640a32 32 0 0 1 32 32v192a32 32 0 1 1-64 0V736a32 32 0 0 1 32-32m448-192a32 32 0 0 1-32 32H736a32 32 0 1 1 0-64h192a32 32 0 0 1 32 32m-640 0a32 32 0 0 1-32 32H96a32 32 0 0 1 0-64h192a32 32 0 0 1 32 32M195.2 195.2a32 32 0 0 1 45.248 0L376.32 331.008a32 32 0 0 1-45.248 45.248L195.2 240.448a32 32 0 0 1 0-45.248m452.544 452.544a32 32 0 0 1 45.248 0L828.8 783.552a32 32 0 0 1-45.248 45.248L647.744 692.992a32 32 0 0 1 0-45.248M828.8 195.264a32 32 0 0 1 0 45.184L692.992 376.32a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0m-452.544 452.48a32 32 0 0 1 0 45.248L240.448 828.8a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0" stroke-width="25.5" stroke="currentColor"/>`
const props = defineProps({
  loading:{
    type:Boolean,
    default:false
  },
  size:{
    type:String,
    default:'3.5rem'
  },
  maskBgColor:{
    type:String,
    default:'rgba(255,255,255,0.9)'
  }
})
</script>

<template>
  <div class="h-full"
       :style="{'--size':size,'--mask-bg-color':maskBgColor}"
       v-loading="loading"
       :element-loading-spinner="epLoadingSpinner"
       element-loading-svg-view-box="0, 0, 1024, 1024"
       element-loading-custom-class="xgrok-loading">
    <slot/>
  </div>
</template>

<style lang="less">
.xgrok-loading{
  .el-loading-spinner{
    svg{
      width: var(--size);
      height: var(--size);
      color: var(--el-color-primary);
    }
  }
}
.el-loading-mask.xgrok-loading{
  background-color: var(--mask-bg-color);
}
</style>
