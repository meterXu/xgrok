<script setup lang="ts">
import {useTemplateRef,watchEffect,onMounted,onUnmounted} from 'vue'
import * as echarts from 'echarts/core';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent
} from 'echarts/components';
import { BarChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import {serverUsage} from '@/api'
import themes from '@/libs/utils/echarts-theme.ts'

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  BarChart,
  CanvasRenderer
]);

const props = defineProps<{
  dateRange: Date[],
  tunnelType:string
}>()

let total = 1
const option = Object.assign({
  title: {
    text: '服务器使用分布图',
    textStyle: {
      fontSize: '3rem',
      fontWeight: 'normal',
      color: '#606266'
    }
  },
  grid:{
    bottom:0
  },
  tooltip: {
    trigger: 'item',
    formatter(params:any){
      return `<div style="display: flex; align-items: center;gap:4rem">
                <span>
                    <span style="display: inline-block;width: 2.5rem; height: 2.5rem; border-radius: 50%;background-color:${params.color}"></span>
                    ${params.name}
                </span>
                <strong>${Math.round(params.value*10000/total)/100}%</strong>
               </div>
               <div>
                <span style="display: inline-block;width: 2.5rem; height: 2.5rem; border-radius: 50%;background-color:${params.color}"></span>
                ${params.data.domain}
                </div>
              `;
    }
  },
  series: [
    {
      name: '',
      type: 'pie',
      radius: ['50%', '70%'],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      },
      data: [],
      label:{
        formatter:'{b}：{c|{c}}',
        rich:{
          c:{
            fontWeight:'bold'
          }
        }
      }
    }
  ]
},themes);

const chartRef = useTemplateRef('chartRef')
let myChart = null as any

function initChart() {
  loadData().then(resOption => {
    myChart = echarts.init(chartRef.value as HTMLElement);
    myChart.setOption(resOption)
  })
}


function loadData() {
  return new Promise((resolve, reject) => {
    serverUsage(props.dateRange[0].valueOf(), props.dateRange[1].valueOf(),props.tunnelType).then(res => {
      option.series[0].data = res.data
      total = res.data.reduce((accumulator:number, current:any) => accumulator + current.value,0)
      resolve(option)
    })
  })
}

const resizeObserver = new ResizeObserver(() => {
  //@ts-ignore
  myChart?.resize();
});

watchEffect(() => {
  initChart()
})
onMounted(() => {
  initChart()
  resizeObserver.observe(chartRef.value as HTMLElement)
})
onUnmounted(() => {
  resizeObserver.disconnect()
})

</script>

<template>
  <div class="h-full w-full" ref="chartRef"></div>
</template>

<style scoped lang="less">

</style>