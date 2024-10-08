<template>
  <div class="chat-container">
    <!-- 聊天记录显示区域 -->
    <div class="chat-box">
      <div class="message" v-for="(message, index) in messages" :key="index">
        <div v-if="message.type === 'user'" class="user-wrapper">
          <div class="user-message">
            <van-image
              class="avatar"
              round
              width="40px"
              height="40px"
              :src="getAssetsFile(userStore.userInfo.avatar)"
            />
            <div class="message-content">{{ message.content }}</div>
          </div>
        </div>
        <div v-else class="ai-message">
          <van-image
            class="avatar"
            round
            width="40px"
            height="40px"
            :src="getAssetsFile('@/assets/Ai.png')"
          />
          <div class="message-content">{{ message.content }}</div>
        </div>
      </div>
      <!-- 如果正在等待 AI 回复，显示加载动画 -->
      <div v-if="isLoading" class="loading-message">
        <van-loading size="24px" />
        <span>AI 正在回复...</span>
      </div>
    </div>

    <!-- 输入框和发送按钮 -->
    <div class="footer">
      <div v-if="!isHistory" class="input-bar">
        <van-field
          v-model="input"
          placeholder="输入你的消息..."
          clearable
          class="input-field"
        />
        <van-button round type="primary" @click="sendMessage">发送</van-button>
      </div>
      <div v-else class="score" @click="toScore">
      对话已结束，点击查看反馈和评价
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useUserStore } from "@/store/modules/user";
import { getAssetsFile } from "@/utils/getImg";
import { useRoute,useRouter } from "vue-router";
import { showNotify } from "vant";
const $router = useRouter();
const route = useRoute();
const isHistory = ref(false); // 是否是历史对话
const routeIndex: any = ref(route.query.index); // 获取传递的 index 参数
const isLoading = ref(false); // 用于控制是否显示加载动画

const userStore = useUserStore();
const input = ref(""); // 用户输入内容

const messages = ref<any>([]);
const messagesArray = ref([
  [
    {
      type: "ai",
      content: "你们的特色炒饭，我刚吃了一口就发现了虫卵，太恶心了!你们这是想害死顾客吗?",
    }, // AI 消息
    {
      type: "user",
      content: "真的吗?这样的话这边我们给您换一盘，并且这单免单了，可以吗",
    }, // AI 消息
    {
      type: "ai",
      content:
        "换一盘?免单?你以为这样就能解决问题吗?我现在很生气，我要你们给我一个解释!这件事到底是怎么发生的?你们的卫生条件到底有没有保障?",
    }, // AI 消息
    {
      type: "user",
      content:
        "您可以直接看到我们的厨房环境的，可能是外面飞进来的虫子，这个我们实在难以避免，但是我们还是给您200元的优惠券",
    }, // AI 消息
    {
      type: "ai",
      content:
        " 什么?外面飞进来的虫子?这听起来完全就是推卸责任!200元优惠券就能解决问题吗?你们的卫生标准太让人失望了，我要见你们的经理，马上!",
    }, // AI 消息
  ],
  [
    {
      type: "ai",
      content: "你们家的牛排上竟然有头发，简直太恶心了！你们的卫生标准到底有没有？",
    },
    {
      type: "user",
      content: "真的很抱歉，我们会重新为您准备一份干净的牛排，同时为您免单，这样可以吗？",
    },
    {
      type: "ai",
      content:
        "免单就可以解决问题吗？我现在已经没有胃口了！我要投诉你们店，我要你们彻底检查卫生条件！",
    },
    {
      type: "user",
      content:
        "我们非常理解您的心情，我们会立即启动内部调查，确保类似情况不再发生，同时为您提供300元的代金券以表歉意。",
    },
    {
      type: "ai",
      content: "你们最好赶紧检查，不然我会在网上公开你们的卫生问题，简直让人无法接受！",
    },
  ],
  [
    {
      type: "ai",
      content: "我在汤里发现了一个塑料片，这可是吃饭的地方，怎么会有这样的东西？",
    },
    {
      type: "user",
      content:
        "非常抱歉，可能是在准备过程中不小心混入了，我们可以马上给您换一份新的汤，您看可以吗？",
    },
    {
      type: "ai",
      content:
        "换一份新的就能解决问题吗？这事太恶劣了！我要你们解释到底怎么会出现这种情况！",
    },
    {
      type: "user",
      content:
        "我们已经紧急通知了厨房团队，正在进行全面检查，同时为您这餐免单，并额外提供100元的优惠券，作为我们的诚意。",
    },
    {
      type: "ai",
      content: "你们的做法让我很失望，我要求见经理，你们给我一个正式的回应！",
    },
  ],
  [
    { type: "ai", content: "你们的烤鸭外焦里生，根本不能吃！你们的厨师是怎么做的？" },
    {
      type: "user",
      content:
        "真的很抱歉，这次的烤鸭可能是时间不够导致的，我们可以为您重新做一份并且这顿饭免费，您觉得怎么样？",
    },
    {
      type: "ai",
      content: "重新做一份？我等了这么久，完全失去了食欲！你们这次真的是让我太失望了。",
    },
    {
      type: "user",
      content:
        "我们非常抱歉，为了表示我们的歉意，我们还将为您提供500元的优惠券，您看如何？",
    },
    {
      type: "ai",
      content: "500元优惠券能挽回我的时间和体验吗？我会把这件事告诉所有朋友，太差劲了！",
    },
  ],
]);
const isHistoryFun = () =>{
  if(route.query.isHistory == '1'){
    isHistory.value = true
  }else{
    isHistory.value = false
  }

  
  }
const toScore  = ()=>{
  $router.push({
    path:'/score',
    query:{
      scoreId:route.query.index,
    },
  })
}

const getHistory = () => {
  const index = parseInt(routeIndex.value); // 将 index 转为数值
  if (!isNaN(index) && index >= 0 && index < messagesArray.value.length) {
    messages.value = messagesArray.value[index];
  } else {
    messages.value = []; // 如果没有对应的 index，展示一个空的消息列表或默认值
  }
  isHistoryFun()
};

// 发送消息的逻辑
const sendMessage = () => {
  if (input.value.trim()) {
    // 将用户的消息添加到消息列表
    messages.value.push({ type: "user", content: input.value });

    // 清空输入框
    input.value = "";

    // 显示加载动画
    isLoading.value = true;

    // 模拟 AI 回复
    setTimeout(() => {
      messages.value.push({ type: "ai", content: "这是 AI 的回复" });

      // 回复后隐藏加载动画
      isLoading.value = false;
    }, 2000); // 假设 AI 回复需要 2 秒
  } else {
    showNotify({
      type: "warning",
      message: "请输入内容",
    });
  }
};

watch(
  () => route.query.index,
  (newIndex) => {
    routeIndex.value = newIndex; // 更新 routeIndex 的值
    getHistory(); // 重新获取历史记录
  }
);

onMounted(() => {
  getHistory();
});
</script>

<style scoped lang="scss">
.score{
  height: 25px;
  text-align: center;
}
.user-wrapper {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  text-align: right;
}

.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  font-size: 16px;
}

.chat-box {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
}

.message {
  display: flex;
  align-items: flex-start;
  margin-bottom: 16px;
}

.user-message {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  .message-content {
    font-size: 16px;
    line-height: 24px;
    background-color: #fff;
    padding: 10px;
    border-radius: 8px;
    max-width: 50%;
    margin-right: 60px;
    text-align: left;
  }
}

.ai-message {
  justify-content: flex-start;
  .message-content {
    font-size: 16px;
    line-height: 24px;
    background-color: #fff;
    padding: 10px;
    border-radius: 8px;
    max-width: 50%;
    margin-left: 50px;
    text-align: left;
  }
}

.avatar {
  margin-right: 8px;
}

.input-bar {
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: #fff;
  border-top: 1px solid #ebebeb;
}

.input-field {
  flex: 1;
  margin-right: 10px;
}

.loading-message {
  display: flex;
  align-items: center;
  margin-top: 10px;
  font-size: 16px;
}

.loading-message van-loading {
  margin-right: 8px;
}
</style>
