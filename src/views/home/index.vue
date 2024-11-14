<template>
  <div class="wrapper">
    <div class="bg">
      <div class="robot-body"></div>
      <div class="robot-bottom"></div>
    </div>
    <div class="title">
      <div class="sesson-title" style="margin-bottom: 10px;">
        <van-icon name="setting-o" style="margin-right: 10px;"/>请选择场景
        </div>
      <van-field
        v-model="selectedSession"
        is-link
        readonly
        label="场景"
        placeholder="选择场景"
        @click="showPicker = true"
        class="home-field"
      />
      
    </div>
    <div class="begin">
      <van-button type="primary" size="normal" block @click="beginChat"
        >开始问答
      </van-button>
    </div>
    <van-popup v-model:show="showPicker" round position="bottom">
        <van-picker
          :columns="sessionStore.sessions.map((item) => ({ text: item.name, value: item.name }))"
          @cancel="showPicker = false"
          @confirm="onConfirm"
        />
      </van-popup>
  </div>
</template>

<script lang="ts" setup>
import { watch } from 'vue'
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/modules/user";
import { useSessionStore } from "@/store/modules/session";
import { showNotify } from "vant";
import { ref } from "vue";
const userStore = useUserStore();
const sessionStore = useSessionStore();
const $router = useRouter();
const showPicker = ref(false);
const columns = ref(sessionStore.sessions.map((item) => ({ text: item.name, value: item.name })));

watch(
  () => sessionStore.sessions, // 确保 watch 的第一个参数是一个函数，返回被监听的值
  (newValue) => {
    columns.value = newValue.map((item) => ({ text: item.name, value: item.name }));
  }
);

const selectedSession = ref("");
const selectedIndex = ref(0)
const onConfirm = ({selectedOptions,selectedIndexes}) => {
  
  selectedSession.value = selectedOptions[0].text;
  selectedIndex.value = selectedIndexes[0];  
  showPicker.value = false;
  
}

const beginChat = () => {
  if (userStore.userInfo.isLogin) {
    $router.push({

      path: "/chat",
      query: {
        testIndex:selectedIndex.value
      }
    });
  } else {
    showNotify({
      type: "warning",
      message: "请先登录",
    });

    $router.push("/user");
  }
};
defineOptions({ name: "Home" });
</script>

<style lang="scss" scoped>
.wrapper {
  position: relative;

  height: 100%;

  .title {
    position: absolute;
    bottom: 7%;
    left: 50%;
    transform: translateX(-50%);
    width: 70%;
    padding: 15px;
    text-align: center;
    font-size: 20px;
    border-radius: 10px;

    .home-field{
      border-radius: 10px;
      box-shadow: 2px 4px 4px 1px rgba(0,0,0,0.05);

    }
  }
  .bg {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 70%;
    width: 70%;
    // background: url("../../assets/robot.png") no-repeat;
    // background-size: cover;
    .robot-body {
      position: absolute;
      left: 35%;
      bottom: 50%;
      width: 110%;
      height: 70%;
      transform: translateX(-50%);
      background: url("../../assets/robot_body.png") no-repeat;
      background-size: contain;
      z-index: 1;

      animation: mymove 1.5s infinite;
      -webkit-animation: mymove 1.5s infinite;
      @keyframes mymove {
        0% {
          transform: translate(0px, 0px);
        }
        50% {
          transform: translate(0px, -10px);
        }
        100% {
          transform: translate(0px, 0px);
        }
      }
    }
    .robot-bottom {
      position: absolute;
      bottom: 30%;
      left: 25%;
      width: 90%;
      height: 40%;
      background: url("../../assets/robot_bottom.png") no-repeat;
      background-size: contain;
      z-index: 0;
    }
  }

  .begin {
    position: absolute;
    left: 50%;
    bottom: 0;
    transform: translateX(-50%);
    width: 70%;
    margin-bottom: 10px;
    .van-button {
      font-size: 16px;
      height: 50px;
      box-shadow: 0px 4px 4px rgba(0,0,0,0.25);
      border-radius: 14px;
      background-color: #17C3CE;
      border-color: #17C3CE;
    }
  }
  
}
</style>
