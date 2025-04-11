<script setup>
import {Check, Edit} from "@element-plus/icons-vue";
import TunnelItem from "@/components/TunnelItem.vue";
import {ref} from "vue";
const categoryType = ref('web')
const tunnelList = ref(null)
tunnelList.value = [
  {id:'xxx',category:'web',name:'开发网址',host:'127.0.0.1',type:2,port:'80',remotePort:null,status:1,link:'https://dev.ngrok.xdo.icu'},
  {id:'xxx',category:'web',name:'324vf',host:'127.0.0.1',type:2,port:'80',remotePort:null,status:1,link:'https://dev.ngrok.xdo.icu'},
  {id:'xxx',category:'web',name:'开发fawefawf',host:'127.0.0.1',type:2,port:'80',remotePort:null,status:1,link:'https://dev.ngrok.xdo.icu'},
  {id:'xxx',category:'web',name:'开发',host:'127.0.0.1',type:2,port:'80',remotePort:null,status:1,link:'https://dev.ngrok.xdo.icu'},
  {id:'xxx',category:'web',name:'f32423',host:'127.0.0.1',type:2,port:'80',remotePort:null,status:1,link:'https://dev.ngrok.xdo.icu'},
  {id:'xxx',category:'web',name:'开发a3fe',host:'127.0.0.1',type:2,port:'80',remotePort:null,status:1,link:'https://dev.ngrok.xdo.icu'},
  {id:'xxx',category:'web',name:'faw',host:'127.0.0.1',type:2,port:'80',remotePort:null,status:1,link:'https://dev.ngrok.xdo.icu'},
  {id:'xxx',category:'web',name:'3fawfawffawe',host:'127.0.0.1',type:2,port:'80',remotePort:null,status:1,link:'https://dev.ngrok.xdo.icu'}
]
function changeHandle(){
  tunnelList.value = [
    {id:'wew',category:'service',name:'远程连接',host:'127.0.0.1',type:1,port:'3389',remotePort:18002,status:1,link:'tcp://ngrok.xdo.icu:18002'},
    {id:'wew',category:'service',name:'远程连接',host:'127.0.0.1',type:1,port:'3389',remotePort:18002,status:1,link:'tcp://ngrok.xdo.icu:18002'},
    {id:'wew',category:'service',name:'远程连接',host:'127.0.0.1',type:1,port:'3389',remotePort:18002,status:1,link:'tcp://ngrok.xdo.icu:18002'},
    {id:'wew',category:'service',name:'远程连接',host:'127.0.0.1',type:1,port:'3389',remotePort:18002,status:1,link:'tcp://ngrok.xdo.icu:18002'}
  ]
}
</script>

<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>隧道列表</span>
        <el-radio-group v-model="categoryType" @change="changeHandle">
          <el-radio-button label="web">
            站点
          </el-radio-button>
          <el-radio-button label="service">
            服务
          </el-radio-button>
        </el-radio-group>
        <el-button class="button" text>新增</el-button>
      </div>
    </template>
    <div class="ngrok-conf-list">
      <ul class="tunnel-ul">
        <li v-for="item in tunnelList" :key="item.id">
          <TunnelItem :item="item"/>
          <div class="tunnel-btn"><el-button text type="success" icon="Edit"></el-button><el-button text type="danger" icon="CircleClose"></el-button></div>
        </li>
      </ul>
    </div>
  </el-card>
</template>

<style lang="less" scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.tunnel-ul{
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
  display: inline-flex;
  flex-flow: column;
  justify-content: flex-start;
  align-items: center;
  grid-gap: 12px;
  li{
    padding: 0 12px;
    height: 48px;
    line-height: 48px;
    width: 100%;
    border: 1px solid #333;
    box-shadow: inset 2px 2px 5px var(--el-bg-color-page), inset -5px -5px 10px var(--el-bg-color-overlay);
    border-radius: 13px;
    display: inline-flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    overflow: hidden;
  }
  .tunnel-btn{
    .el-button{
      padding: 8px;
    }
    .el-button+.el-button{
      margin-left: 4px;
    }
  }
}
</style>
