<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import * as echarts from 'echarts'

const chargeChartRef = ref<HTMLDivElement>()
const energyChartRef = ref<HTMLDivElement>()
const accessChartRef = ref<HTMLDivElement>()

const charts: echarts.ECharts[] = []

const chartPalette = ['#2f6bff', '#00b8a9', '#ffb020', '#ff6b6b', '#7c3aed']

const createChart = (
  el: HTMLDivElement | undefined,
  option: echarts.EChartsCoreOption,
) => {
  if (!el) return

  const chart = echarts.init(el)
  chart.setOption(option)
  charts.push(chart)
}

const renderCharts = () => {
  createChart(chargeChartRef.value, {
    color: chartPalette,
    grid: {
      top: 58,
      right: 24,
      bottom: 28,
      left: 42,
    },
    title: {
      text: '年度收费趋势',
      subtext: '停车 / 物业 / 能源',
      left: 0,
      top: 2,
      textStyle: {
        color: '#1f2a44',
        fontSize: 15,
        fontWeight: 600,
      },
      subtextStyle: {
        color: '#8a94a6',
        fontSize: 12,
      },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: '#9aa7bd',
        },
      },
      valueFormatter: (value: number | string) => `${value} 万元`,
    },
    legend: {
      top: 8,
      right: 0,
      itemWidth: 10,
      itemHeight: 10,
      textStyle: {
        color: '#667085',
      },
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月'],
      axisLine: {
        lineStyle: {
          color: '#d8dee9',
        },
      },
      axisLabel: {
        color: '#667085',
      },
    },
    yAxis: {
      type: 'value',
      splitLine: {
        lineStyle: {
          color: '#edf1f7',
        },
      },
      axisLabel: {
        color: '#667085',
      },
    },
    series: [
      {
        name: '停车收费',
        type: 'line',
        smooth: true,
        symbolSize: 7,
        lineStyle: {
          width: 3,
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(47, 107, 255, .24)' },
            { offset: 1, color: 'rgba(47, 107, 255, 0)' },
          ]),
        },
        data: [8.6, 10.2, 13.4, 12.7, 16.1, 18.8, 21.4],
      },
      {
        name: '物业缴费',
        type: 'line',
        smooth: true,
        symbolSize: 7,
        lineStyle: {
          width: 3,
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(0, 184, 169, .2)' },
            { offset: 1, color: 'rgba(0, 184, 169, 0)' },
          ]),
        },
        data: [5.4, 7.1, 7.6, 9.3, 11.5, 12.2, 13.7],
      },
      {
        name: '能源代收',
        type: 'bar',
        barWidth: 12,
        itemStyle: {
          borderRadius: [8, 8, 0, 0],
        },
        data: [3.8, 4.2, 4.8, 5.6, 6.1, 6.8, 7.2],
      },
    ],
  })

  createChart(energyChartRef.value, {
    color: ['#2f6bff', '#00b8a9', '#ffb020', '#f04438'],
    title: {
      text: '能源结构',
      subtext: '今日园区负载',
      left: 0,
      top: 0,
      textStyle: {
        color: '#1f2a44',
        fontSize: 15,
        fontWeight: 600,
      },
      subtextStyle: {
        color: '#8a94a6',
        fontSize: 12,
      },
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}<br/>{c} kWh ({d}%)',
    },
    legend: {
      bottom: 0,
      left: 'center',
      itemWidth: 9,
      itemHeight: 9,
      textStyle: {
        color: '#667085',
      },
    },
    series: [
      {
        name: '能源结构',
        type: 'pie',
        radius: ['40%', '56%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: true,
        padAngle: 3,
        itemStyle: {
          borderColor: '#fff',
          borderRadius: 8,
          borderWidth: 3,
        },
        label: {
          color: '#344054',
          fontSize: 12,
          formatter: '{b}\n{d}%',
        },
        labelLine: {
          length: 8,
          length2: 6,
        },
        data: [
          { value: 42, name: '照明' },
          { value: 30, name: '空调' },
          { value: 18, name: '充电桩' },
          { value: 10, name: '安防' },
        ],
      },
    ],
  })

  createChart(accessChartRef.value, {
    color: ['#2f6bff', '#00b8a9', '#ffb020'],
    title: {
      text: '通行与告警',
      subtext: '近 24 小时',
      left: 0,
      top: 0,
      textStyle: {
        color: '#1f2a44',
        fontSize: 15,
        fontWeight: 600,
      },
      subtextStyle: {
        color: '#8a94a6',
        fontSize: 12,
      },
    },
    radar: {
      center: ['50%', '57%'],
      radius: '62%',
      splitNumber: 4,
      axisName: {
        color: '#475467',
        fontSize: 12,
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(102, 112, 133, .22)',
        },
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(102, 112, 133, .18)',
        },
      },
      splitArea: {
        areaStyle: {
          color: ['rgba(47, 107, 255, .04)', 'rgba(0, 184, 169, .04)'],
        },
      },
      indicator: [
        { name: '车辆通行', max: 100 },
        { name: '访客预约', max: 100 },
        { name: '一体杆在线', max: 100 },
        { name: '告警处置', max: 100 },
        { name: '巡检完成', max: 100 },
      ],
    },
    tooltip: {
      trigger: 'item',
    },
    series: [
      {
        name: '园区态势',
        type: 'radar',
        symbolSize: 6,
        lineStyle: {
          width: 3,
        },
        areaStyle: {
          opacity: 0.16,
        },
        data: [
          {
            value: [92, 76, 96, 84, 88],
            name: '今日表现',
          },
          {
            value: [78, 68, 90, 73, 80],
            name: '昨日表现',
          },
        ],
      },
    ],
  })
}

const resizeCharts = () => {
  charts.forEach((chart) => chart.resize())
}

onMounted(async () => {
  await nextTick()
  renderCharts()
  window.addEventListener('resize', resizeCharts)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeCharts)
  charts.forEach((chart) => chart.dispose())
})
</script>

<template>
  <div class="workbench-page">
    <el-row :gutter="20">
      <el-col :span="17">
        <div class="card-container data-overview">
          <div class="card-title">园区数据</div>
          <div class="card-statistic">
            <el-statistic :value="56233.03">
              <template #title>年度累计收费（元）</template>
            </el-statistic>
            <el-statistic :value="6">
              <template #title>入驻企业总数（个）</template>
            </el-statistic>
            <el-statistic :value="5">
              <template #title>月卡车辆总数（辆）</template>
            </el-statistic>
            <el-statistic :value="48">
              <template #title>一体杆总数（台）</template>
            </el-statistic>
          </div>
        </div>
        <div class="card-container chart-card chart-card-large">
          <div ref="chargeChartRef" class="chart-main"></div>
        </div>
        <div class="card-container chart-card">
          <div ref="accessChartRef" class="chart-main"></div>
        </div>
      </el-col>
      <el-col :span="7">
        <div class="card-container chart-card energy-card">
          <div ref="energyChartRef" class="chart-main"></div>
        </div>
        <div class="card-container insight-card">
          <div class="card-title">运营亮点</div>
          <div class="insight-list">
            <div class="insight-item">
              <span class="insight-dot is-blue"></span>
              <div>
                <strong>收费达成率 86%</strong>
                <p>本月停车与物业缴费保持增长。</p>
              </div>
            </div>
            <div class="insight-item">
              <span class="insight-dot is-green"></span>
              <div>
                <strong>设备在线率 96%</strong>
                <p>一体杆、门禁和照明状态稳定。</p>
              </div>
            </div>
            <div class="insight-item">
              <span class="insight-dot is-orange"></span>
              <div>
                <strong>告警平均处置 12 分钟</strong>
                <p>高峰期巡检响应效率优于昨日。</p>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.workbench-page {
  min-height: 100%;
  background:
    radial-gradient(circle at 12% 0%, rgba(47, 107, 255, 0.09), transparent 26%),
    linear-gradient(180deg, #f7f9fc 0%, #eef3f8 100%);
  padding: 2px;

  .card-container {
    margin-bottom: 20px;
    padding: 22px 24px;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.92);
    border: 1px solid rgba(221, 228, 238, 0.85);
    border-radius: 8px;
    box-shadow: 0 12px 30px rgba(31, 42, 68, 0.06);
  }

  .card-title {
    margin-bottom: 20px;
    font-size: 14px;
    font-weight: 600;
    color: #1f2a44;
  }

  .card-statistic {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 18px;
  }
}

.data-overview {
  position: relative;

  &::after {
    position: absolute;
    top: 0;
    right: 0;
    width: 180px;
    height: 100%;
    pointer-events: none;
    content: '';
    background: linear-gradient(135deg, rgba(47, 107, 255, 0.1), rgba(0, 184, 169, 0));
  }
}

.chart-card {
  height: 286px;
}

.chart-card-large {
  height: 318px;
}

.energy-card {
  height: 360px;
}

.chart-main {
  width: 100%;
  height: 100%;
}

.insight-card {
  min-height: 244px;
}

.insight-list {
  display: grid;
  gap: 18px;
}

.insight-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;

  strong {
    display: block;
    margin-bottom: 4px;
    font-size: 14px;
    font-weight: 600;
    color: #1f2a44;
  }

  p {
    margin: 0;
    font-size: 12px;
    line-height: 1.6;
    color: #667085;
  }
}

.insight-dot {
  width: 9px;
  height: 9px;
  margin-top: 5px;
  border-radius: 50%;
  box-shadow: 0 0 0 5px rgba(47, 107, 255, 0.1);

  &.is-blue {
    background: #2f6bff;
  }

  &.is-green {
    background: #00b8a9;
    box-shadow: 0 0 0 5px rgba(0, 184, 169, 0.1);
  }

  &.is-orange {
    background: #ffb020;
    box-shadow: 0 0 0 5px rgba(255, 176, 32, 0.14);
  }
}

.el-statistic {
  --el-statistic-content-font-size: 28px;
  --el-statistic-title-font-size: 13px;
}

:deep(.el-statistic__head) {
  margin-bottom: 12px;
  color: #667085;
}

:deep(.el-statistic__content) {
  font-weight: 700;
  color: #1f2a44;
}
</style>
