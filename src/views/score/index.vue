<template>
  <div class="score-container">
    <van-nav-bar title="员工陪练评分" />
    <!-- 图表展示 -->
    <div id="scoreChart" style="width: 100%; height: 300px"></div>

    <!-- 建议展示（折叠展开） -->
    <van-collapse v-model="activeNames">
      <van-collapse-item title="倾听建议" name="listen">
        {{ suggestions.listen }}
      </van-collapse-item>
      <van-collapse-item title="道歉建议" name="apology">
        {{ suggestions.apology }}
      </van-collapse-item>
      <van-collapse-item title="解决建议" name="solve">
        {{ suggestions.solve }}
      </van-collapse-item>
      <van-collapse-item title="感谢建议" name="thank">
        {{ suggestions.thank }}
      </van-collapse-item>
    </van-collapse>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import * as echarts from "echarts";
import { useRoute } from "vue-router";

// 当前活跃的折叠项
const activeNames = ref<string[]>([]);

const route = useRoute();
const suggestionsList = ref([
  {
    listen: "提高倾听技巧，适当给予客户反馈。",
    apology: "适时道歉，并表达对客户困扰的理解。",
    solve: "快速有效地解决客户问题，减少等待时间。",
    thank: "在问题解决后，表达对客户的感谢。",
  },
  {
    listen: "更加关注客户的需求，适时做出回应。",
    apology: "确保道歉诚恳，并安抚客户情绪。",
    solve: "更迅速地找到问题根源，并提供有效解决方案。",
    thank: "感谢客户的耐心与理解，积极沟通后续服务。",
  },
  {
    listen: "倾听客户抱怨时，展现更多的同理心。",
    apology: "道歉时强调责任，并提供解决方法。",
    solve: "尽可能详细地解释解决问题的过程，缓解客户担忧。",
    thank: "感谢客户在此过程中保持合作与耐心。",
  },
]);

const scoreList = ref([
  {
    listen: 8,
    apology: 7,
    solve: 9,
    thank: 8,
    average: 8, // 平均分
  },
  {
    listen: 6,
    apology: 8,
    solve: 8,
    thank: 7,
    average: 7.25, // 平均分
  },
  {
    listen: 7,
    apology: 7,
    solve: 9,
    thank: 9,
    average: 8, // 平均分
  },
]);

const scores = ref(scoreList.value[Number(route.query.scoreId)]);
const suggestions = ref(suggestionsList.value[Number(route.query.scoreId)]);

watch(
  () => route.query.scoreId,
  (newValue) => {
    scores.value = scoreList.value[Number(newValue)];
    suggestions.value = suggestionsList.value[Number(newValue)];
  }
);

// 图表初始化
const initChart = () => {
  const chartDom = document.getElementById("scoreChart")!;
  const myChart = echarts.init(chartDom);
  const option = {
    title: {
      text: "员工评分",
      left: "top",
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
            value: [
              scores.value.listen,
              scores.value.apology,
              scores.value.solve,
              scores.value.thank,
              scores.value.average,
            ],
            name: "评分",
          },
        ],
      },
    ],
  };
  myChart.setOption(option);
};

// 初始化图表
onMounted(() => {
  initChart();
});
</script>

<style scoped lang="scss">
.van-cell {
  margin-top: 15px;
}
.score-container {
  padding: 16px;
}
#scoreChart {
  margin-top: 20px;
}
</style>
