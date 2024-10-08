<template>
  <div class="wrapper">
    <div class="bg">
      <div class="robot-body"></div>
      <div class="robot-bottom"></div>
    </div>
    <div class="title">
      <div class="sesson-title" style="margin-bottom: 20px;">
        <van-icon name="setting-o" style="margin-right: 10px;"/>请选择场景
        </div>
      <van-field
        v-model="selectedSession"
        is-link
        readonly
        label="场景"
        placeholder="选择场景"
        @click="showPicker = true"
      />
      <van-popup v-model:show="showPicker" round position="bottom">
        <van-picker
          :columns="columns"
          @cancel="showPicker = false"
          @confirm="onConfirm"
        />
      </van-popup>
    </div>
    <div class="begin">
      <van-button type="primary" size="normal" block @click="beginChat"
        >开始问答
      </van-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/modules/user";
import { useSessionStore } from "@/store/modules/session";
import { showNotify } from "vant";
import { ref } from "vue";
const userStore = useUserStore();
const sessionStore = useSessionStore();
const $router = useRouter();
const showPicker = ref(false);
const columns = ref(sessionStore.sessions.map((item) => {return {text:item.name, value:item.name}}));

const selectedSession = ref("");
const onConfirm = ({selectedOptions}) => {
  selectedSession.value = selectedOptions[0].text;
  showPicker.value = false;
  
}

const beginChat = () => {
  if (userStore.userInfo.isLogin) {
    $router.push("/chat");
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
    padding: 15px;
    text-align: center;
    font-size: 20px;

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
      left: 5%;
      bottom: 25%;
      width: 110%;
      height: 70%;
      background: url("../../assets/robot_body.png") no-repeat;
      background-size: contain;
      z-index: 2;

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
      bottom: 0;
      left: 0;
      width: 90%;
      height: 40%;
      background: url("../../assets/robot_bottom.png") no-repeat;
      background-size: contain;
      z-index: 1;
    }
  }

  .begin {
    position: absolute;
    right: 10%;
    bottom: 30%;
    transform: translateY(50%);
    width: 100px;
    height: 50px;
    .van-button {
      border-radius: 25px;
    }
  }
}
</style>
