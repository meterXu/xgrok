<script setup>
import {defineProps} from 'vue'
import {StarFilled, Star} from '@element-plus/icons-vue'
const props = defineProps(['serverConfig','statusClass'])
</script>

<template>
  <div class="selected-server-info-wrap">
    <div class="server-info-name">
      <span class="info-name">
        {{props.serverConfig.name}}
        <span class="vip-icon" v-if="serverConfig.is_vip">
          <el-icon>
            <i-icon-park-outline-lightning/>
          </el-icon>
        </span>
      </span>
      <slot></slot>
    </div>
    <div class="server-info-footer">
      <div class="server-info-speed">
        <span>带宽 {{props.serverConfig.up_speed}}</span>，<span>{{props.serverConfig.region}}/{{props.serverConfig.operator||'-'}}</span>
      </div>
      <div class="server-status">
        <span class="server-status-icon" :class="statusClass"></span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.selected-server-info-wrap{
  width: 100%;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  background: var(--server-info-bg);
}
.server-info-name{
  padding: 8px;
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
  justify-content: space-between;
}
.server-info-speed{
  font-size: 14px;
}
.switch-btn{
  font-weight: normal;
  font-size: 12px;
  cursor: pointer;
}
.free-icon{
  color: var(--el-color-success);
}
.vip-icon{
  color: var(--el-color-warning);
}
.server-info-footer{
  padding: 8px;
  display: flex;
  flex-flow: row;
  align-items: center;
  justify-content: space-between;
}
.info-name{
  font-size: 14px;
  height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  grid-gap: 4px;
  .vip-icon,.free-icon{
    display: inline-flex;
  }
}
.server-status{
  width: 46px;
  text-align: center;
}
.server-status-icon{
  position: relative;
  display: inline-block;
  width: 12px;
  height: 12px;
  border: var(--edit-icon-color);
  border-radius: 50%;
  background-color: #dedede;
}
.server-status-icon-success{
  background-color: var(--el-color-success);
}
.server-status-icon-danger{
  background-color: var(--el-color-danger);
}
.server-status-online,.server-status-offline{
  &:after{
    position: absolute;
    display: inline-block;
    width: 3px;
    height: 3px;
    border-radius: 50%;
    content: '';
    left: 90%;
    top: 90%;
  }
  &:before{
    position: absolute;
    display: inline-block;
    content: '';
    left: 50%;
    top: 50%;
    width: 140%;
    height: 140%;
    border-radius: 50%;
    border: 1px solid var(--light-border-color);
    transform: translate(-50%, -50%);
  }
}
.server-status-online{
  animation: revolve 1s linear infinite;
  &:after{
    background-color: var(--el-color-success);;
  }
}
.server-status-offline{
  animation: dithering .5s linear infinite;
  &:after{
    background-color: var(--el-color-danger);;
  }
}
.server-status-checking{
  animation: checking .8s ease-in-out infinite;
}

@keyframes checking{
  0%{
    background-color: #dedede;
    width: 12px;
    height: 12px;
    transform: translateY(0); /* 恢复到初始位置 */
  }
  50%{
    width: 14px;
    height: 14px;
    background-color: var(--el-color-success);
  }
  100%{
    width: 12px;
    height: 12px;
    background-color: #dedede;
  }
}
@keyframes revolve {
  0%{
    transform: rotate(0deg);
  }
  100%{
    transform: rotate(360deg);
  }
}

@keyframes dithering{
  0%{
    transform: rotate(0deg);
  }
  25%{
    transform: rotate(-12deg);
  }
  50%{

  }
  75%{
    transform: rotate(-12deg);
  }
  100%{
    transform: rotate(0deg);
  }
}
</style>