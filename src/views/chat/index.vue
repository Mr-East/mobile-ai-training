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
    </div>

    <!-- 输入框和发送按钮 -->
    <div class="input-bar">
      <van-field
        v-model="input"
        placeholder="输入你的消息..."
        clearable
        class="input-field"
      />
      <van-button round type="primary" @click="sendMessage">发送</van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useUserStore } from "@/store/modules/user";
import { getAssetsFile } from "@/utils/getImg";
const userStore = useUserStore();
const input = ref(""); // 用户输入内容
const messages = ref([
  { type: "ai", content: "你们的特色炒饭，我刚吃了一口就发现了虫卵，太恶心了!你们这是想害死顾客吗?" }, // AI 消息
  { type: "user", content: "真的吗?这样的话这边我们给您换一盘，并且这单免单了，可以吗" }, // AI 消息
  { type: "ai", content: "换一盘?免单?你以为这样就能解决问题吗?我现在很生气，我要你们给我一个解释!这件事到底是怎么发生的?你们的卫生条件到底有没有保障?" }, // AI 消息
  { type: "user", content: "您可以直接看到我们的厨房环境的，可能是外面飞进来的虫子，这个我们实在难以避免，但是我们还是给您200元的优惠券" }, // AI 消息
  { type: "ai", content: " 什么?外面飞进来的虫子?这听起来完全就是推卸责任!200元优惠券就能解决问题吗?你们的卫生标准太让人失望了，我要见你们的经理，马上!" }, // AI 消息
]);

// 发送消息的逻辑
const sendMessage = () => {
  if (input.value.trim()) {
    // 将用户的消息添加到消息列表
    messages.value.push({ type: "user", content: input.value });

    // 清空输入框
    input.value = "";

    // 模拟 AI 回复
    setTimeout(() => {
      messages.value.push({ type: "ai", content: "这是 AI 的回复" });
    }, 1000);
  }
};
</script>

<style scoped lang="scss">
.user-wrapper{
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
  justify-content: flex-end;
  text-align: right;
}

.ai-message {
  justify-content: flex-start;
}

.message-content {
  font-size: 16px;
  line-height: 24px;
  background-color: #fff;
  padding: 10px;
  border-radius: 8px;
  max-width: 60%;
  margin-left:50px;
  text-align: left;
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
</style>
