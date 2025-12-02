<script setup lang="ts">
import {onMounted, onUnmounted, useTemplateRef, watchEffect, ref} from "vue";
import * as echarts from 'echarts/core';
import {TitleComponent, TooltipComponent, LegendComponent} from 'echarts/components';
import {PieChart} from 'echarts/charts';
import {LabelLayout} from 'echarts/features';
import {CanvasRenderer} from 'echarts/renderers';
import {productSales} from "@/api";
import themes from '@/libs/utils/echarts-theme.ts'
import {debounce} from 'lodash-es'

echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  PieChart,
  CanvasRenderer,
  LabelLayout
]);

const props = defineProps<{
  dateRange: Date[]
}>()

let total = 1
const option = Object.assign({
  title: {
    top:0,
    text: '产品销量',
    textStyle: {
      fontSize: '12px',
      fontWeight: 'normal',
      color: '#606266'
    }
  },
  grid:{
    bottom:0
  },
  padding: [-100, 0,0,0],
  tooltip: {
    trigger: 'item',
    formatter(params: any) {
      return `<div style="display: flex; align-items: center;gap:4rem">
                <span>
                    <span style="display: inline-block;width: 2.5rem; height: 2.5rem; border-radius: 50%;background-color:${params.color}"></span>
                    ${params.name}
                </span>
                <strong>${Math.round(params.value * 10000 / total) / 100}%</strong>
               </div>
              `;
    }
  },
  series: [
    {
      name: '',
      type: 'pie',
      radius: '60%',
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      },
      data: [],
      label: {
        formatter: '{b}：{c|{c}份}',
        rich: {
          c: {
            fontWeight: 'bold'
          }
        }
      }
    }
  ]
}, themes);
const chartRef = useTemplateRef('chartRef')
let myChart = null as any

function initChart(startDate:number, endDate:number) {
  loadData(startDate,endDate).then(resOption => {
    myChart.setOption(resOption)
  })
}

const debounceInitChart=debounce((startDate:number, endDate:number)=>{
  initChart(startDate,endDate)
},500)


function loadData(startDate:number, endDate:number) {
  return new Promise((resolve, reject) => {
    productSales(startDate, endDate).then(res => {
      option.series[0].data = res.data
      total = res.data.reduce((accumulator: number, current: any) => accumulator + current.value, 0)
      resolve(option)
    })
  })
}

const resizeObserver = new ResizeObserver(() => {
  //@ts-ignore
  myChart?.resize();
});

watchEffect(() => {
  debounceInitChart(props.dateRange[0].valueOf(), props.dateRange[1].valueOf())
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
