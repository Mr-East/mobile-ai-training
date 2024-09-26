<template>
  <div class="wrapper">
    <div class="bg"></div>
    <div class="title"><span>欢迎来到AI智能陪练~</span></div>
    <div class="begin">
      <van-button type="primary" size="normal" block @click="beginChat"
        >开始问答
      </van-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
const $router = useRouter();

const beginChat = () => {
  $router.push("/chat");
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
    bottom: -10%;
    left: -17%;
    height: 90%;
    width: 70%;
    background: url("../../assets/robot.png") no-repeat;
    background-size: cover;
  }

  .begin {
    position: absolute;
    right: 20%;
    bottom: 50%;
    transform: translateY(50%);
    width: 100px;
    height: 50px;
  }
}
</style>
