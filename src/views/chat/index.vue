<template>
  <div class="chat-container">
    <!-- 聊天记录显示区域 -->
    <div class="chat-box">
      <div class="message" v-for="(message, index) in messages" :key="index">
        <div v-if="message.type === 'user'" class="user-message">
          <van-image
            class="avatar"
            round
            width="40px"
            height="40px"
            src="https://example.com/user-avatar.jpg"
          />
          <div class="message-content">{{ message.content }}</div>
        </div>
        <div v-else class="ai-message">
          <van-image
            class="avatar"
            round
            width="40px"
            height="40px"
            src="https://example.com/ai-avatar.jpg"
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
        :right-icon="null"
        class="input-field"
      />
      <van-button round type="primary" @click="sendMessage">发送</van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const input = ref(""); // 用户输入内容
const messages = ref([
  { type: "ai", content: "您好，我是 AI，请问有什么可以帮助您的？" }, // AI 消息
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
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
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
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 8px;
  max-width: 60%;
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
