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

    <div class="seesion-advice">
      <div class="ai-avatar"></div>

      <div class="content">
        <div class="title">AI场景建议</div>
        <div class="advice">
          {{ advice }}
        </div>
      </div>
    </div>
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
    listen:
      "提升倾听技巧，专注于客户的语言和情绪，保持眼神接触或通过适当的语气表达关注，适时给予客户反馈以显示理解。",
    apology:
      "在客户表达不满后，及时道歉，并真诚表达对客户遇到问题的理解，让客户感受到您的共情和责任感。",
    solve:
      "在了解问题的关键后，迅速采取行动，提供有效的解决方案，减少客户的等待时间，并让客户明白解决步骤。",
    thank: "在问题成功解决后，真诚地感谢客户的耐心和合作，同时强调对客户支持的重视。",
  },
  {
    listen:
      "在倾听客户需求时，更加专注，表现出对客户的重视，适时用言语或肢体语言回应客户，确认您理解了客户的核心问题。",
    apology:
      "当客户受到困扰时，给予诚挚的道歉，尤其是在处理过程有延误或造成客户不便时，明确表达您的歉意并安抚客户的情绪。",
    solve:
      "迅速识别并找出问题的根源，给出详细、清晰的解决方案，让客户清楚地了解到您的处理进展，增强客户的信任感。",
    thank:
      "感谢客户的理解和耐心，特别是在需要更多时间的情况下，向客户表达对他们支持的感激之情，并为他们提供后续的服务沟通。",
  },
  {
    listen:
      "在客户倾诉不满或抱怨时，展现更多的同理心，适当地回应客户的情绪，用积极的肢体语言或肯定语句引导客户继续表达。",
    apology:
      "道歉时要真诚且负责任，明确指出造成问题的原因，同时提出可以立即实施的解决方法，安抚客户的焦虑感。",
    solve:
      "向客户详细解释解决问题的每一个步骤，让客户对问题解决的过程有清晰的了解，并确保在实施过程中随时更新客户进展，消除客户的担忧。",
    thank:
      "感谢客户在整个过程中表现出的合作与耐心，并表达对客户的持续关注，以便未来提供更优质的服务体验。",
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

const adviceList = ref([
  "在处理顾客食品品质问题时（如发现食品中有头发丝或飞虫等），首先应表现出真诚的关切，仔细倾听顾客的反馈，立即道歉并表明对此情况的重视。迅速采取措施更换有问题的餐品，向顾客解释可能的原因，并向其保证已采取改善措施。同时，感谢顾客提出的问题，表示此反馈将帮助门店进一步提升品质与服务水平。\n" ,
    "针对门店卫生环境问题（如清洁不到位），应立刻对顾客表达歉意并表明改进的决心。听取顾客意见后，可进一步向顾客了解其具体关注的区域，积极记录，并承诺立即跟进，确保卫生符合标准。此外，感谢顾客的反馈，告知其已将问题上报并将进行必要的整改，提供更加舒适的用餐体验。\n" ,
    "在处理顾客餐点遗漏的情况时，首先应耐心倾听顾客的投诉，向顾客表示抱歉并详细确认漏掉的餐品项目。迅速补齐遗漏餐品或提供适当补偿以安抚顾客，同时解释此情况并承诺今后加强点餐流程的管理，减少疏漏。感谢顾客的耐心和理解，并表示会持续改善服务质量，以提供更优质的用餐体验。",
]);
const advice = ref(adviceList.value[Number(route.query.scoreId)]);
const scores = ref(scoreList.value[Number(route.query.scoreId)]);
const suggestions = ref(suggestionsList.value[Number(route.query.scoreId)]);

watch(
  () => route.query.scoreId,
  (newValue) => {
    scores.value = scoreList.value[Number(newValue)];
    suggestions.value = suggestionsList.value[Number(newValue)];
    advice.value = adviceList.value[Number(newValue)];
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
        label: {
          show: false, // 显示数据标签
        },
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
.seesion-advice {
  margin-top: 25px;
  width: 100%;
  position: relative;

  .ai-avatar {
    position: absolute;
    top: 10px;
    left: 10px;
    height: 25px;
    width: 25px;
    background: url("@/assets/advice.png") no-repeat center/cover;
  }
  .content {
    
    border-radius: 10px;
    border: 2px dashed #17c3ce;
    padding-bottom: 10px;
    .advice{
      width: 95%;
      margin:  0 auto;
      font-size: 16px;
    }
    .title {
      margin-left: 35px;
      font-size: 16px;
      line-height: 45px;
      font-weight: 600;
      position: relative;
      &::after {
        content: "";
        position: absolute;
        left: -5px;
        width: 2px;
        height: 45px;
        color: #17c3ce;
      }
    }
  }
}
</style>
