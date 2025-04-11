<script setup>
import {defineProps,computed} from 'vue';
import {Link} from "@element-plus/icons-vue";
const {item} = defineProps(['item'])
const name = computed(()=>{
  switch (item.category){
    case 'web':{
      return '站点'
    }case 'service':{
      return '服务'
    }default:{
      return null
    }
  }
})
</script>

<template>
  <div class="tunnel-text-wrap">
    <span class="tunnel-text"><el-text type="info">{{name}}：</el-text><el-text type="success">{{item.name}}</el-text></span>
    <el-divider direction="vertical" border-style="dashed"></el-divider>
    <span class="tunnel-text"><el-text type="info">本地地址：</el-text><el-text type="deeppink">{{item.host}}</el-text></span>
    <el-divider direction="vertical" border-style="dashed"></el-divider>
    <span class="tunnel-text"><el-text type="info">本地端口：</el-text><el-text type="deeppink">{{item.port}}</el-text></span>
    <template v-if="item.remotePort">
      <el-divider direction="vertical" border-style="dashed"></el-divider>
      <span class="tunnel-text"><el-text type="info">远程端口：</el-text><el-text type="danger">{{item.remotePort}}</el-text></span>
    </template>
    <el-divider direction="vertical" border-style="dashed"></el-divider>
    <span class="tunnel-text">
      <el-link href="https://dev.ngrok.xdo.icu" target="_parent" :icon="Link" type="primary">
        {{item.link}}
      </el-link>
    </span>
  </div>
</template>

<style lang="less" scoped>
.tunnel-text-wrap{
  .tunnel-text{
    .el-link{
      height: 24px;
      grid-gap: 4px;
    }
  }
  .el-text--deeppink{
    color:deeppink
  }
}
</style>
