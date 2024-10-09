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
        <div v-if="isListening" class="listening-indicator">
          <span>正在录音...</span>
        </div>
        <van-icon
          name="service-o"
          style="height: 100%; cursor: pointer"
          @click="toggleVoiceInput"
        />
        <van-button round type="primary" @click="sendMessage">发送</van-button>
        <template v-if="!isStop">
          <van-button round type="danger" @click="stopMessage">停止</van-button>
        </template>
        <template v-else>
          <van-button loading type="danger" />
        </template>
      </div>
      <div v-else class="score" @click="toScore">对话已结束，点击查看反馈和评价</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useUserStore } from "@/store/modules/user";
import { getAssetsFile } from "@/utils/getImg";
import { useRoute, useRouter } from "vue-router";
import { showNotify } from "vant";
const $router = useRouter();
const route = useRoute();
const isHistory = ref(false); // 是否是历史对话
const routeIndex: any = ref(route.query.index); // 获取传递的 index 参数
const isLoading = ref(false); // 用于控制是否显示加载动画

const userStore = useUserStore();
const input = ref(""); // 用户输入内容
const isStop = ref(false); // 是否停止发送消息
const messages = ref<any>([]);
let testIndex = 0;
const testMes = [
  {
    type: "ai",
    content: "你们的牛排太生了，根本没法吃！你们的厨师是不是不专业？",
  }, // AI 消息
  {
    type: "user",
    content: "真的很抱歉，可能是烹饪时间不够，我们可以给您重新做一份，您看可以吗？",
  }, // 用户回复
  {
    type: "ai",
    content: "重新做一份就能解决问题了吗？我已经等了很久了！你们这是在浪费我的时间！",
  }, // AI 消息
  {
    type: "user",
    content:
      "我们非常理解您的感受，为了弥补您的等待，我们这顿饭将为您免单，并且给您300元的代金券作为补偿。",
  }, // 用户回复
  {
    type: "ai",
    content: "免单和代金券就够了吗？你们的服务质量让我非常失望，我要投诉你们！",
  }, // AI 消息
  {
    type: "user",
    content:
      "真的非常抱歉让您感到如此失望，我们非常重视您的反馈。我们会立即将您的情况反馈给经理，并对我们的服务和烹饪流程进行严格审查。同时，我们也会主动联系您，进一步了解如何能够弥补您的不满。感谢您给我们提出改进的机会。",
  }, // 用户回复
  {
    type: "ai",
    content: "希望你们能真正改善，不要让其他顾客也有同样的糟糕体验。",
  }, // AI 消息
];
const messagesArray = ref([
  [
    {
      type: "user",
      content: "你好，请问需要什么帮助吗",
    }, // AI 消息
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
      type: "user",
      content: "你好，请问需要什么帮助吗",
    }, // AI 消息
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
      type: "user",
      content: "你好，请问需要什么帮助吗",
    }, // AI 消息
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
const isHistoryFun = () => {
  if (route.query.isHistory == "1") {
    isHistory.value = true;
  } else {
    isHistory.value = false;
  }
};
const toScore = () => {
  $router.push({
    path: "/score",
    query: {
      scoreId: route.query.index || 0,
    },
  });
};
const stopMessage = () => {
  isStop.value = true;
  setTimeout(() => {
    isStop.value = false;
    isHistory.value = true;
  }, 2000);
};
const getHistory = () => {
  const index = parseInt(routeIndex.value); // 将 index 转为数值
  if (!isNaN(index) && index >= 0 && index < messagesArray.value.length) {
    messages.value = messagesArray.value[index];
  } else {
    messages.value = []; // 如果没有对应的 index，展示一个空的消息列表或默认值
  }
  isHistoryFun();
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
      messages.value.push({ type: "ai", content: testMes[testIndex].content });
      testIndex = testIndex + 2;
      // 回复后隐藏加载动画
      isLoading.value = false;
      if (testIndex > testMes.length) {
        setTimeout(() => {
          isHistory.value = true;
        }, 2000);
      }
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
const toggleVoiceInput = () => {
  if (isListening.value) {
    stopListening();
  } else {
    startListening();
  }
};

const recognition = ref<any>(null);
const isListening = ref(false); // 控制语音识别状态
const transcript = ref(""); // 保存语音转文字结果
const isSpeechRecognitionSupported =
  !!window.SpeechRecognition || !!window.webkitSpeechRecognition;

if (isSpeechRecognitionSupported) {
  recognition.value = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.value.lang = "zh-CN"; // 设置语言为中文
  recognition.value.interimResults = false; // 是否显示实时结果
  recognition.value.continuous = false; // 是否连续监听
}

const startListening = () => {
  if (recognition.value) {
    recognition.value.start(); // 开始语音识别
    isListening.value = true;
  }
};

const stopListening = () => {
  if (recognition.value) {
    recognition.value.stop(); // 停止语音识别
    isListening.value = false;
  }
};

if (recognition.value) {
  recognition.value.onresult = (event: any) => {
    const result = event.results[0][0].transcript; // 获取语音转换后的文本
    transcript.value = result; // 保存结果
    input.value = result; // 将结果填充到输入框
  };

  recognition.value.onspeechend = () => {
    stopListening(); // 当检测到用户停止说话时，停止监听
  };

  recognition.value.onerror = (event: any) => {
    stopListening(); // 处理错误时停止监听
    showNotify({
      type: "danger",
      message: "语音识别失败，请重试",
    });
  };
}
</script>

<style scoped lang="scss">
.score {
  height: 40px;
  text-align: center;
  background-color: #fff;
  border-top: 1px solid #ebebeb;
  cursor: pointer;
  &:hover {
    color: #1989fa;
  }
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

.van-button {
  height: 40px;
  margin: 0px 5px;
}
.van-button--loading {
  border-radius: 5px;
}
</style>
