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
            <div class="message-content user">{{ message.content }}</div>
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
          <div class="message-content aimsg">{{ message.content }}</div>
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
let msgIndex = ref(Number(route.query.testIndex) || 0);
watch(
  () => route.query.testIndex,
  (newValue) => {
    msgIndex.value = Number(newValue);
  }
);
let testIndex = 0;
const testMes = [
  [
    {
      type: "ai",
      content:
        "我在你们的炒饭里吃出了一只虫卵，这太恶心了！你们餐厅的卫生标准到底在哪里？",
    }, // AI 消息
    {
      type: "user",
      content:
        "真的非常抱歉让您遇到这样的情况，我们非常重视卫生标准。我们会立刻撤下这道菜并为您重新准备一份干净的炒饭。这顿饭将为您免单，同时我们提供300元的代金券作为补偿。您觉得这样可以吗？",
    }, // 用户回复
    {
      type: "ai",
      content:
        "免单和代金券就能解决问题吗？我现在非常生气！虫卵这种事情完全无法接受，我怀疑你们的卫生状况！",
    }, // AI 消息
    {
      type: "user",
      content:
        "我们非常理解您的愤怒，确实这样的事情是不该发生的。我们已经通知了厨房，正在全面检查卫生情况，确保类似问题不会再次发生。我们也愿意邀请您参观我们的厨房设施，亲眼看看我们的卫生措施。我们会非常认真对待您的反馈，并立即展开调查。",
    }, // 用户回复
    {
      type: "ai",
      content:
        "参观厨房？你觉得我现在还有心情吗？如果我去卫生部门投诉，你们可就不是免单和代金券能解决的了。",
    }, // AI 消息
    {
      type: "user",
      content:
        "您的投诉我们非常重视，也完全理解您的担忧。我们愿意承担任何进一步的责任，并将积极配合卫生部门的检查。您提出的任何意见，我们都会认真对待并作出改进。同时，我们想为您提供一份VIP客户体验卡，确保您未来在我们的餐厅享受到更高品质的服务。再次感谢您给我们改进的机会。",
    }, // 用户回复
    {
      type: "ai",
      content:
        "希望你们这次的改善是认真的，我暂时不会投诉，但你们最好真的做出改变，否则我一定会采取进一步行动。",
    }, // AI 消息
    {
      type: "user",
      content:
        "感谢您的理解和宽容。我们保证会采取所有必要的改进措施，并持续提升我们的卫生标准。如果您有任何进一步的意见或需求，随时可以联系我们，我们会第一时间回应。再次对今天的体验表示诚挚的歉意。",
    }, // 用户回复
  ],
  [
    {
      type: "ai",
      content: "我刚刚在你们餐厅的过道上摔了一跤，地面滑得要命！你们这是怎么回事？",
    }, // AI 消息
    {
      type: "user",
      content:
        "非常抱歉让您受到这样的惊吓，可能是清洁后地面湿滑导致的。我们会立即安排人员查看并处理问题区域，确保安全。请问您是否需要医疗帮助？我们可以立即为您联系医护人员。",
    }, // 用户回复
    {
      type: "ai",
      content:
        "暂时不需要医护人员，但你们怎么能让顾客走在这么危险的地面上？你们的安全措施太不到位了！",
    }, // AI 消息
    {
      type: "user",
      content:
        "我们深感抱歉，安全问题是我们工作的重点。我们会立即加强地面防滑措施，并检查所有区域的安全性。为了表达我们的歉意，今天的餐费我们将免单，另外我们愿意提供500元的代金券补偿您受到的影响。再次抱歉让您有如此糟糕的经历。",
    }, // 用户回复
    {
      type: "ai",
      content:
        "免单和代金券就够了吗？如果我摔得严重一点，你们还打算这么轻描淡写地处理吗？这次真的是让我对你们餐厅彻底失望了！",
    }, // AI 消息
    {
      type: "user",
      content:
        "非常理解您的愤怒，您受的委屈我们绝不忽视。我们已经立即启动了内部安全流程改进方案，确保每一位顾客的安全。为了进一步表明我们的诚意，我们将为您提供VIP客户卡，以保证未来为您提供更优质的服务。如果您对这次事件有任何进一步的建议或要求，我们随时愿意倾听。",
    }, // 用户回复
    {
      type: "ai",
      content:
        "VIP客户卡？你们的服务倒是体贴，不过我不想再有类似经历。我会观察你们的改进，如果下次再有问题，我绝不会轻易放过！",
    }, // AI 消息
    {
      type: "user",
      content:
        "非常感谢您对我们的宽容和理解，我们会将您的反馈作为未来改进的动力。我们承诺所有顾客的安全和体验都是我们的第一要务。期待下次您能见证我们的改变，再次对今天的经历表示深深的歉意。",
    }, // 用户回复
  ],
  [
    {
      type: "ai",
      content:
        "你好，我点的餐有一道菜根本没送过来！你们的服务也太不到位了吧，我已经等了很久。",
    }, // AI 消息
    {
      type: "user",
      content:
        "非常抱歉让您久等了，请问是哪道菜没有送到？我们立刻核实并尽快为您补上，真的很抱歉给您带来了不便。",
    }, // 用户回复
    {
      type: "ai",
      content:
        "我点了三道菜，但少了一份牛排。你们难道不核对订单吗？这种情况实在让人失望。",
    }, // AI 消息
    {
      type: "user",
      content:
        "真的非常抱歉，经过核实确实是我们的疏忽导致牛排未送达。我们马上为您补上，并为您提供免费甜品作为补偿。同时，您点的牛排我们会加急处理，确保您能尽快享用。再次抱歉给您带来的不便。",
    }, // 用户回复
    {
      type: "ai",
      content:
        "等了这么久，免费的甜品就能解决问题吗？我现在已经没有什么食欲了。你们的服务效率真让人怀疑。",
    }, // AI 消息
    {
      type: "user",
      content:
        "我们理解您的心情，延误确实让您的用餐体验受到了影响。为此，我们决定将您的整顿餐免单，并提供200元的代金券以表达我们的诚意。我们非常重视您的反馈，保证这种情况不会再发生。我们也希望您能够再次光临，见证我们的改善。",
    }, // 用户回复
    {
      type: "ai",
      content:
        "免单和代金券就够了吗？你们的服务这么差，让我觉得再来你们这里是个错误。我很怀疑你们能不能真的改善。",
    }, // AI 消息
    {
      type: "user",
      content:
        "我们对您的不满深感抱歉。为了进一步表示我们的诚意，我们将为您提供VIP卡，确保您下次可以享受更优质的服务体验。我们已经对服务流程进行了调整，所有订单会在出餐前再次确认，以避免任何遗漏。希望您能给我们一个机会，让我们重新赢得您的信任。",
    }, // 用户回复
    {
      type: "ai",
      content:
        "VIP卡倒是挺吸引人的，但我现在最担心的是你们能不能真的提升服务，避免再次出现这种问题。我可不想下次来还是遇到同样的事情。",
    }, // AI 消息
    {
      type: "user",
      content:
        "我们完全理解您的顾虑，您的反馈对我们非常重要。我们会将这次的情况作为重要的改进案例，并严格监督后续服务流程的改进。您每次用餐后都可以给我们直接反馈，我们会特别关注您的体验。再次对今天发生的一切表示深深的歉意，希望您能见证我们的进步。",
    }, // 用户回复
    {
      type: "ai",
      content:
        "好吧，希望你们这次说到做到。这次就算了，但下次再有问题我绝对不会轻易原谅。",
    }, // AI 消息
    {
      type: "user",
      content:
        "感谢您的宽容，我们会竭尽全力确保类似问题不再发生。期待您的再次光临，给我们机会为您提供更好的用餐体验。如果您有任何需求，随时联系我们，我们会第一时间为您服务。",
    }, // 用户回复
  ],
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
      scoreId: route.query.index || route.query.testIndex || 0,
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
    console.log(msgIndex.value);

    // 将用户的消息添加到消息列表
    messages.value.push({ type: "user", content: input.value });

    // 清空输入框
    input.value = "";

    // 显示加载动画
    isLoading.value = true;

    // 模拟 AI 回复
    setTimeout(() => {
      messages.value.push({
        type: "ai",
        content: testMes[msgIndex.value][testIndex].content,
      });
      testIndex = testIndex + 2;
      // 回复后隐藏加载动画
      isLoading.value = false;
      if (testIndex > testMes[msgIndex.value].length) {
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

import { onBeforeRouteLeave } from "vue-router";

// 当离开这个页面时进行清理
onBeforeRouteLeave((to, from, next) => {
  // 这里可以执行页面离开时的销毁或清理逻辑

  // 可以执行一些必要的清理操作，比如重置变量、停止监听等
  testIndex = 0; // 清空输入框
  messages.value = []; // 清空消息
  msgIndex.value = 0;
  next(); // 确保路由可以正常跳转
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
  // background-color: rgba(255,255,255,0.5);

  background-image: url('@/assets/ChatBG.jpg')  ;
  background-repeat: no-repeat;
  background-size: cover;
  
  z-index: 0;
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
    max-width: 50%;
    margin-right: 60px;
    text-align: left;
    
  }
  
  .user{
    background-color: #17C3CE;
    border-radius: 10px 0px 10px 10px;
    color: white;
    // clip-path: ;
  }
  
}

.ai-message {
  justify-content: flex-start;
  .message-content {
    font-size: 16px;
    line-height: 24px;
    background-color: #fff;
    padding: 10px;
    max-width: 50%;
    margin-left: 50px;
    text-align: left;
  }
  .aimsg{
    border-radius: 0px 10px 10px 10px;
  }
}

.avatar {
  margin-right: 8px;
}

.input-bar {
  display: flex;
  align-items: center;
  padding: 10px;
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
