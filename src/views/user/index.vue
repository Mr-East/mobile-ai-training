<template>
  <div class="user-container">
    <div v-if="userStore.userInfo.isLogin" class="logout_wrapper">
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
      <div class="logout">
        <van-button type="primary" size="normal" block @click="onLogout"
          >退出登录</van-button
        >
      </div>
    </div>
    <div v-else class="login">
      <div class="login-bg"></div>
      <div class="login-title">智训</div>
      <div class="login_wrapper">
        <van-cell-group>
          <van-field v-model="loginUsername" label="用户名" placeholder="请输入用户名" />
          <van-field
            v-model="password"
            label="密码"
            type="password"
            placeholder="请输入密码"
          />
        </van-cell-group>

        <div class="login-button">
          <van-button type="primary" block @click="onLogin" size="normal"
            >登录
            </van-button>
          <div class="register">没有账号?立即注册</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useUserStore } from "@/store/modules/user";
import { getAssetsFile } from "@/utils/getImg";
import { showNotify } from "vant";
import {useRouter} from 'vue-router'
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
}
.logout {
  margin-top: 20px;
}
.login {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
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
    top: -35%;
    left: 0;
    width: 100%;
    height: 135%;
    background: url("@/assets/loginBG.png") no-repeat center center;
    background-size: cover;
    z-index: 0;
  }
}
.login_wrapper {
  width: 80%;
  background-color: #fff;
  padding: 20px;
  border-radius: 25px;
  margin: 0 auto;
  z-index: 1;
}

.login-button {
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
  .van-button {
    height: 25px;
    width: 40%;
    border-radius: 25px;
  }
  .register {
    line-height: 25px;
    font-size: 16px;
    cursor: pointer;

    color: #1989fa;
  }
}
</style>
