<template>
  <div class="wrapper">
    <div v-if="!userStore.userInfo.isLogin" class="not-login">
      <div class="bg"></div>
      <van-button
        type="primary"
        block
        @click="toLogin"
        size="normal"
        class="login-button"
      >
        请先登录
      </van-button>
    </div>
    <div v-else class="task">
      <van-tabs v-model="activeTab" class="task-tabs">
        <van-tab title="学习任务">
          <div class="task-item study" v-for="(task, index) in studyTasks" :key="index">
            <div class="video-container">
              <img
                :src="getAssetsFile(task.thumbnail)"
                alt="视频封面"
                class="video-thumbnail"
                
              />
              <div class="overlay" @click="toVideo(task.url)">
                <van-icon name="play-circle-o" class="play-icon" />
              </div>
            </div>

            <div class="task-info">
              <div class="task-title">{{ task.title }}</div>
              <div class="task-status">
                <span>任务状态：</span>
                <span :class="task.completed ? 'completed' : 'incomplete'">
                  {{ task.completed ? "已完成" : "未完成" }}
                </span>
              </div>
            </div>
          </div>
        </van-tab>
        <van-tab title="考核任务">
          <div class="task-item" v-for="(task, index) in assessmentTasks" :key="index">
            <div class="task-title">{{ task.title }}</div>
            <div class="task-desc">
              <span>{{ task.description }}</span>
              <div class="icon" @click="toChat(index)">
                <van-icon name="arrow" />
              </div>
            </div>
            <div class="task-status">
              <span>任务状态：</span>
              <span :class="task.completed ? 'completed' : 'incomplete'">
                {{ task.completed ? "已完成" : "未完成" }}
              </span>
            </div>
          </div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "@/store/modules/user";
import { useRouter } from "vue-router";
import { ref } from "vue";
import { getAssetsFile } from "@/utils/getImg";
const userStore = useUserStore();
const $router = useRouter();
const activeTab = ref(0);

const toLogin = () => {
  $router.push("/user");
};
const toChat = (index:number)=>{
  $router.push({
    path: "/chat",
    query: {
      testIndex:index,
    }
  });
}
const toVideo = (url:string) => {
  console.log(111);
  
  window.open(url, "_blank", "noopener,noreferrer");

};
// 静态数据示例
const studyTasks = ref([
  { title: "观看平台使用手册", completed: true, thumbnail: "@/assets/video1.png",url:'https://www.bilibili.com/video/BV19tUgY5EJY?spm_id_from=333.1007.tianma.1-1-1.click' },
  { title: "观看平台操作流程", completed: false, thumbnail: "@/assets/video2.png",url:'https://www.bilibili.com/video/BV19tUgY5EJY?spm_id_from=333.1007.tianma.1-1-1.click' },
]);

const assessmentTasks = ref([
  {
    title: "食品品质问题处理",
    description: "顾客食品品质有问题，有头发丝或飞虫，需要解决",
    completed: false,
  },
  {
    title: "卫生环境服务问题",
    description: "门店卫生清洁不到位，需要解决",
    completed: false,
  },
  {
    title: "餐点有遗漏处理",
    description: "顾客菜单少上漏上，需要解决",
    completed: false,
  },
]);
</script>

<style scoped lang="scss">
.wrapper {
  width: 100%;
  height: 100%;
}
.not-login {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .bg {
    height: 50%;
    width: 50%;
    background: url("@/assets/notlogin.png") no-repeat center/contain;
  }
  .van-button {
    width: 80%;
    font-size: 16px;
    height: 50px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 14px;
    background-color: #17c3ce;
    border-color: #17c3ce;
  }
}

.task-tabs {
  padding: 16px;
}
.study {
  display: flex;
  align-items: center;
}
.task-item {
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;

  .video-container {
    position: relative;
    width: 100px;
    height: 60px;
    margin-right: 16px;
    cursor: pointer;

    .video-thumbnail {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5); /* 半透明黑色遮盖层 */
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .play-icon {
      font-size: 24px;
      color: white;
    }

    &:hover .overlay {
      opacity: 1; /* 鼠标悬停时显示遮盖层 */
    }
  }

  .task-title {
    font-size: 16px;
    font-weight: 600;
  }
  .task-desc {
    font-size: 16px;
    margin-top: 4px;
    color: #666;
    display: flex;
    justify-content: space-between;
    .icon{
      cursor: pointer;
    }
  }
  .task-status {
    margin-top: 8px;
    font-size: 14px;
    .completed {
      color: green;
    }
    .incomplete {
      color: red;
    }
  }
}
</style>
