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
import {userOrderTop} from '@/api'
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
  type: string
}>()

const option = Object.assign({
  title: {
    text: '用户订单数',
    textStyle: {
      fontSize: '3rem',
      fontWeight:'normal',
      color:'#606266'
    }
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
      name: '订单数',
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

function initChart() {
  loadData().then(resOption => {
    myChart = echarts.init(chartRef.value as HTMLElement);
    myChart.setOption(resOption)
  })
}


function loadData() {
  return new Promise((resolve, reject) => {
    userOrderTop(props.dateRange[0].valueOf(), props.dateRange[1].valueOf()).then(res => {
      option.yAxis.data = res.data.map((d: any) => {
        return d.username
      })
      option.series[0].data = res.data.map((d: any) => {
        return d.order_count
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