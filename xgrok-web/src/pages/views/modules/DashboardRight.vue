<script setup>
import {ref} from 'vue'
import {coverEnum} from "@/utils";
import {Select} from '@element-plus/icons-vue'
const serverInfo = ref(null)
serverInfo.value = {
  ipAddress:'ngrok.xdo.icu',
  status:1,
  hasSsl:1
}
</script>

<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>服务详情</span>
        <el-button class="button" text>选择</el-button>
      </div>
    </template>
    <div v-if="serverInfo" class="ngrok-server-info">
      <div class="info-head">
        <el-text class="domain">{{serverInfo.ipAddress}}</el-text>
        <el-tag type="success">{{coverEnum('status',serverInfo.status)}}</el-tag>
        <el-tag v-if="serverInfo.hasSsl">{{coverEnum('ssl',serverInfo.hasSsl)}}</el-tag>
      </div>
      <div class="info-pie">
        <svg version="1.1" viewBox="0 0 200 200">
          <text class="liquidFillGaugeText" text-anchor="middle" font-size="16px" transform="translate(100,60)" style="fill: var(--el-text-color-regular)">上行</text>
          <text class="liquidFillGaugeText" text-anchor="middle" font-size="36px" transform="translate(100,110)" style="fill: var(--el-text-color-regular)">50Mb</text>
          <defs>
            <linearGradient id="bg">
              <stop offset="0%" style="stop-color:rgba(252,141,202,0.5)"></stop>
              <stop offset="50%" style="stop-color:rgba(255, 20, 147, 0.5)"></stop>
              <stop offset="100%" style="stop-color:rgba(204,36,190,0.5)"></stop>
            </linearGradient>
            <path id="wave" fill="url(#bg)" d="M0 100 C90 28, 92 179, 200 100 A95 95 0 0 1 0 100 Z">
              <animate dur="5s" repeatCount="indefinite" attributeName="d" attributeType="XML" values="M0 100 C90 28, 92 179, 200 100 A95 95 0 0 1 0 100 Z;
														M0 100 C145 100, 41 100, 200 100 A95 95 0 0 1 0 100 Z;
														M0 100 C90 28, 92 179, 200 100 A95 95 0 0 1 0 100 Z"></animate>
            </path>
          </defs>
          <use xlink:href="#wave" opacity=".8">
          </use>
          <circle cx="100" cy="100" r="80" stroke-width="10" stroke="#1d1e1f" fill="transparent"></circle>
          <circle cx="100" cy="100" r="90" stroke-width="20" stroke="deeppink" fill="none" class="percentage-pie-svg"></circle>
        </svg>
      </div>
    </div>
    <div v-else class="ngrok-server-unset" >
      <el-icon class="unset-icon"><Select/></el-icon>
      <span>选择一个隧道服务</span>
    </div>
  </el-card>
</template>

<style lang="less" scoped>
.ngrok-server-unset{
  position: absolute;
  width: 300px;
  height: 300px;
  border: 2px dashed var(--el-border-color);
  border-radius: 3px;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-flow: column;
  color: var(--el-border-color);
  font-size: 16px;
  .unset-icon{
    font-size: 100px;
  }
  span{
    margin-top: 24px;
  }
}

.ngrok-server-info{
  position: absolute;
  left: 50%;
  top:50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-flow: column;
  transform: translate(-50%,-50%);
  .info-head{
    display: inline-flex;
    border: 1px solid #333;
    box-shadow: inset 2px 2px 5px var(--el-bg-color-page), inset -5px -5px 10px var(--el-bg-color-overlay);
    border-radius: 13px;
    height: 80px;
    line-height: 80px;
    padding: 0 12px;
    justify-content: center;
    align-items: center;
    grid-gap: 8px;
    .el-tag{
      transform: translateY(3px);
    }
  }
  .domain{
    font-size: 48px;
  }
  .info-pie{
    width: 300px;
    height: 300px;
    margin-top: 40px;
    svg{
      width: 300px;
      height: 300px;
    }
  }
}
</style>
