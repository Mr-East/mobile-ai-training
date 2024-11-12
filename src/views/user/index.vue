<template>
  <div class="user-container">
    <div v-if="userStore.userInfo.isLogin" class="logout_wrapper">
    <div class="title">个人页面</div>
      <van-cell-group>
        <div class="user-info">
          <van-image
            round
            width="100px"
            height="100px"
            :src="getAssetsFile(userStore.userInfo.avatar)"
            fit="cover"
          />
          <p class="username">{{ userStore.userInfo.username }}</p>
        </div>
      </van-cell-group>
      <div v-if="!userStore.userInfo.isAdmin" class="title">员工评分</div>
      <div v-if="!userStore.userInfo.isAdmin" id="scoreChart" style="width: 100%; height: 300px"></div>
      <div class="logout">
        <van-button type="primary" size="normal" block @click="onLogout"
          >退出登录</van-button
        >
      </div>
    </div>
    <div v-else class="login">
      <div class="login-bg"></div>
      <!-- <div class="login-title">智训</div> -->
      <div class="login_wrapper">
      <div class="title">登录</div>
        <van-cell-group>
          <van-field v-model="loginUsername" label="用户名" placeholder="请输入用户名"  />
          <van-field
            v-model="password"
            label="密码"
            type="password"
            placeholder="请输入密码"
          />
        </van-cell-group>

     
          <div class="register">没有账号?立即注册</div>
        
        <van-button type="primary" block @click="onLogin" size="normal" class="login-button"
            >登录
            </van-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref,onMounted, nextTick } from "vue";
import { useUserStore } from "@/store/modules/user";
import { getAssetsFile } from "@/utils/getImg";
import { showNotify } from "vant";
import {useRouter} from 'vue-router'
import * as echarts from "echarts";
const userStore = useUserStore();
const $router = useRouter()

// 登录界面输入的用户名和密码
const loginUsername = ref("");
const password = ref("");

const onLogin = () => {
  // 这里可以放置实际的登录逻辑，比如调用 API
  if (loginUsername.value && password.value) {
    userStore.userInfo.isLogin = true;
    if(loginUsername.value === "admin" && password.value === "111") { userStore.userInfo.isAdmin = true; }
    userStore.userInfo.username = loginUsername.value; // 设置登录后的用户名
    showNotify({
      type: "success",
      message: "登录成功",
    })
     nextTick(() => {initChart()})
  } else {
    showNotify({
      type: "danger",
      message: "用户名或密码不能为空",
    })
  }
};

const onLogout = () => {
  userStore.userLogOut();
  $router.push("/user");
  showNotify({
    type: "success",
    message: `退出登录成功`,
  });
};

const scores = ref({
  listen: 7,
  apology: 6,
  solve: 8,
  thank: 9,
  average: 7,
})
const initChart = () => {
  const chartDom = document.getElementById("scoreChart")!;
  const myChart = echarts.init(chartDom);
  const option = {
    title: {
      text: "平均评分",
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
  // initChart()
});
</script>

<style scoped lang="scss">
.van-cell-group {
  border-radius: 25px;
}
.user-container {
  display: flex;
  height: 100%;

  justify-content: center;
  align-items: center;
}
.user-info {
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-top: 20px;
}
.username {
  margin-top: 10px;
  font-size: 18px;
  font-weight: bold;
}
.logout_wrapper {
  width: 80%;
  background-color: #fff;
  padding: 20px;
  border-radius: 25px;
  margin: 0 auto;
  .title{
    font-size: 30px;
    font-weight: 500;
    margin-bottom: 25px;
    margin-left: 15px;
    position: relative;
    &::after{
      content: '';
      position: absolute;
      top: 9px;
      left: -20px;
      width: 3px;
      height: 30px;
      background-color: #17C3CE;
      margin-left: 10px;
    }
  }
}
.logout {
  margin-top: 20px;
}
.login {
  width: 100%;
  height: 100%;
  // display: flex;
  // justify-content: center;
  // align-items: center;
  // flex-direction: column;
  position: relative;
  &-title {
    font-size: 48px;
    font-weight: 500;
    color: #fff;
    z-index: 1;
    margin-bottom: 25px;
  }
  &-bg {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 80%;
    height: 40%;
    background: url("@/assets/Chatbot.png") no-repeat center center;
    background-size: contain;
    z-index: 0;
  }
}
.login_wrapper {
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  background-color: #fff;
  padding: 20px;
  border-radius: 25px;
  margin: 0 auto;
  z-index: 1;
  position: absolute;
  .title{
    font-size: 30px;
    font-weight: 500;
    margin-bottom: 25px;
    margin-left: 15px;
    position: relative;
    &::after{
      content: '';
      position: absolute;
      top: 9px;
      left: -20px;
      width: 3px;
      height: 30px;
      background-color: #17C3CE;
      margin-left: 10px;
    }
  }
}


.van-field{
  margin-bottom: 10px;
  height: 70px;
  font-size: 16px;
}

// .van-button {
//     margin: 0 auto;
//     height: 25px;
//     width: 80%;
//     border-radius: 25px;
//     text-align: center;
//   }

  .van-button {
      font-size: 16px;
      height: 50px;
      box-shadow: 0px 4px 4px rgba(0,0,0,0.15);
      border-radius: 14px;
      background-color: #17C3CE;
      border-color: #17C3CE;
    }
.register {
  margin: 10px 0px;
    line-height: 25px;
    font-size: 16px;
    cursor: pointer;
    text-align: right;
    color: #1989fa;
    
  }

</style>
