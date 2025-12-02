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
import {userTunnelTop} from '@/api'
import themes from '@/libs/utils/echarts-theme.ts'
import {debounce} from 'lodash-es'

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
  tunnelType: string
}>()

const option = Object.assign({
  title: {
    top:0,
    text: '用户隧道数',
    textStyle: {
      fontSize: '12px',
      fontWeight:'normal',
      color:'#606266'
    }
  },
  grid:{
    bottom:0
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  xAxis: {
    type: 'value',
    boundaryGap: [0, 0.01]
  },
  yAxis: {
    type: 'category',
    data: []
  },
  series: [
    {
      name: '隧道数',
      type: 'bar',
      data: [],
      label:{
        show:true
      }
    }
  ]
},themes);

const chartRef = useTemplateRef('chartRef')
let myChart = null as any

function initChart(startDate:number,endDate:number,tunnelType:string) {
  loadData(startDate,endDate,tunnelType).then(resOption => {
    myChart.setOption(resOption)
  })
}

const debounceInitChart = debounce((startDate,endDate,tunnelType)=>{initChart(startDate,endDate,tunnelType)},500)

function loadData(startDate:number,endDate:number,tunnelType:string) {
  return new Promise((resolve, reject) => {
    userTunnelTop(startDate,endDate,tunnelType).then(res => {
      option.yAxis.data = res.data.map((d: any) => {
        return d.username
      })
      option.series[0].data = res.data.map((d: any) => {
        return d.tunnel_count
      })
      resolve(option)
    })
  })
}

const resizeObserver = new ResizeObserver(() => {
  //@ts-ignore
  myChart?.resize();
});

watchEffect(() => {
  debounceInitChart(props.dateRange[0].valueOf(), props.dateRange[1].valueOf(), props.tunnelType)
})
onMounted(() => {
  myChart = echarts.init(chartRef.value as HTMLElement);
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
