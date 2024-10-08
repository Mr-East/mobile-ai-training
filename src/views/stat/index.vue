<template>
  <div class="admin-stat-container">
    <van-nav-bar title="管理员统计界面" />
    <!-- 对话总体数量 -->
    <div id="conversationChart" style="width: 100%; height: 300px"></div>

    <!-- 平均评分 -->
    <div
      id="averageScoreChart"
      style="width: 100%; height: 300px; margin-top: 20px"
    ></div>

    <!-- 培训完成率 -->
    <div
      id="completionRateChart"
      style="width: 100%; height: 300px; margin-top: 20px"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import * as echarts from "echarts";

// 对话总体数量数据（柱状图）
const conversationData = {
  employees: ["张三", "李四", "王五", "赵六"],
  counts: [120, 150, 90, 180], // 每个员工完成的对话数量
};

// 平均评分数据（雷达图）
const averageScoreData = {
  dimensions: ["倾听", "道歉", "解决", "感谢"],
  scores: [8.2, 7.5, 9.0, 8.0, 7.5], // 评分维度的平均分
};

// 培训完成率数据（饼图）
const completionRateData = {
  modules: ["模块一", "模块二", "模块三", "模块四"],
  rates: [90, 75, 80, 95], // 每个培训模块的完成率百分比
};

// 初始化图表
const initConversationChart = () => {
  const chartDom = document.getElementById("conversationChart")!;
  const myChart = echarts.init(chartDom);
  const option = {
    title: {
      text: "员工完成的对话总数",
      left: "left",
    },
    xAxis: {
      type: "category",
      data: conversationData.employees,
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: conversationData.counts,
        type: "bar",
        name: "对话总数",
        barWidth: "50%",
      },
    ],
  };
  myChart.setOption(option);
};

const initAverageScoreChart = () => {
  const chartDom = document.getElementById("averageScoreChart")!;
  const myChart = echarts.init(chartDom);
  const option = {
    title: {
      text: "评分维度的平均分",
      left: "left",
    },
    radar: {
      indicator: [
        { name: "倾听", max: 10 },
        { name: "道歉", max: 10 },
        { name: "解决", max: 10 },
        { name: "感谢", max: 10 },
        { name: "综合", max: 10 },
      ],
    },
    series: [
      {
        type: "radar",
        data: [
          {
            value: averageScoreData.scores,
            name: "平均分",
          },
        ],
      },
    ],
  };
  myChart.setOption(option);
};

const initCompletionRateChart = () => {
  const chartDom = document.getElementById("completionRateChart")!;
  const myChart = echarts.init(chartDom);
  const option = {
    title: {
      text: "培训完成率",
      left: "left",
    },
    tooltip: {
      trigger: "item",
    },
    series: [
      {
        name: "完成率",
        type: "pie",
        radius: "50%",
        data: completionRateData.modules.map((module, index) => ({
          name: module,
          value: completionRateData.rates[index],
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };
  myChart.setOption(option);
};

// 初始化所有图表
onMounted(() => {
  initConversationChart();
  initAverageScoreChart();
  initCompletionRateChart();
});
</script>

<style scoped lang="scss">
.admin-stat-container {
  padding: 16px;
}
#conversationChart,
#averageScoreChart,
#completionRateChart {
  margin-bottom: 20px;
}
</style>
