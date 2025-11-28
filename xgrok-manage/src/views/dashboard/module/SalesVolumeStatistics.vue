<script setup lang="ts">
import {onMounted, onUnmounted, useTemplateRef, watchEffect} from "vue";
import * as echarts from 'echarts/core';
import {salesVolumeStatistics} from "@/api";
import {TitleComponent, GridComponent} from 'echarts/components';
import {LineChart} from 'echarts/charts';
import {UniversalTransition} from 'echarts/features';
import {CanvasRenderer} from 'echarts/renderers';

echarts.use([
  TitleComponent,
  GridComponent,
  LineChart,
  CanvasRenderer,
  UniversalTransition
]);

const props = defineProps<{
  dateRange: Date[],
  type: string
}>()
const option = {
  title: {
    text: '销售额',
    textStyle:{
      fontSize:14
    }
  },
  xAxis: {
    type: 'category',
    data: []
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [],
      type: 'line'
    }
  ]
}
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
    salesVolumeStatistics(props.dateRange[0].valueOf(), props.dateRange[1].valueOf(), props.type).then(res => {
      if (props.type === 'week') {
        option.xAxis.data = res.data.map((d: any) => {
          return d.year + '-' + d.week
        })
      } else {
        option.xAxis.data = res.data.map((d: any) => {
          return d[props.type]
        })
      }
      option.series[0].data = res.data.map((d: any) => {
        return d.amount
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
  <div class="absolute h-full w-full" ref="chartRef"></div>
</template>

<style scoped lang="less">

</style>