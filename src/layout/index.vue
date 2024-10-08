<template>
  <van-sticky ref="stickyRef">
    <van-nav-bar :title="$route.meta?.title">
      <!-- 左边图标，绑定点击事件 -->
      <template #left>
        <van-icon name="wap-nav" size="18" @click="toggleSidebar" />
      </template>
      <!-- 右边图标 -->
      <template #right>
        <van-icon name="search" size="18" />
      </template>
    </van-nav-bar>
  </van-sticky>

  <!-- 主内容区域 -->
  <div class="container">
    <router-view #="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </div>

  <!-- 底部导航 -->
  <van-tabbar ref="tabbarRef" route>
    <template v-for="item in routes" :key="item.name">
      <template v-if="!item.meta?.hidden">
        <van-tabbar-item :to="item.path" :icon="item.meta?.icon">
          {{ item.meta?.title }}
        </van-tabbar-item>
      </template>
    </template>
  </van-tabbar>

  <!-- 侧边栏 -->
  <van-overlay :show="isSidebarOpen" @click="toggleSidebar" />
  <van-sidebar v-if="isSidebarOpen" class="sidebar" v-model="activeHistoryIndex">
    <div class="header">
      <van-image
        round
        width="100px"
        height="100px"
        :src="getAssetsFile(userStore.userInfo.avatar)"
        fit="cover"
      />
      <div class="name">{{ userStore.userInfo.username }}</div>
    </div>

    <div class="history">
      <div class="title">陪练历史记录</div>
      <van-sidebar-item
        v-for="(item, index) in sidebarItems"
        :key="item"
        @click="handleSidebarItemClick(item, index)"
        :title="item"
      >
      </van-sidebar-item>
    </div>

    <div class="footer">
      <van-button type="primary" block @click="onLogOut" size="normal" class="logout"
            >退出登录
       </van-button>
    </div>

  </van-sidebar>
</template>

<script lang="ts" setup>
import { ref, nextTick,watch } from "vue";
import { Sticky, Tabbar, showNotify } from "vant";
import { main,admin } from "@/router/modules/main";
import { useUserStore } from "@/store/modules/user";
import { getAssetsFile } from "@/utils/getImg";
import { useRouter } from "vue-router";
const $router = useRouter();
const userStore = useUserStore();
const activeHistoryIndex = ref(0);
// 定义布局组件
defineOptions({ name: "Layout" });

const stickyRef = ref<InstanceType<typeof Sticky>>();
const tabbarRef = ref<InstanceType<typeof Tabbar>>();
const containerHeight = ref("");
// 侧边栏的控制
const isSidebarOpen = ref(false); // 控制侧边栏的开关状态
const sidebarItems = ["对话1", "对话2", "对话3"]; // 假设侧边栏有的选项
const routes = ref(main)
watch(()=> userStore.userInfo.isAdmin,(newValue)=>{
   routes.value = newValue ? admin : main
})
// 切换侧边栏开关状态
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

// 处理侧边栏点击事件
const handleSidebarItemClick = (item: string, index: number) => {
  activeHistoryIndex.value = index;
  showNotify({
    type: "success",
    message: `查看${item}成功`,
  });
  $router.push({
    path: "/chat",
    query: {
      index: index,
    },
  });
  toggleSidebar(); // 选择后自动关闭侧边栏
};
const onLogOut = () => {
  userStore.userLogOut();
  $router.push("/user");
  showNotify({
    type: "success",
    message: `退出登录成功`,
  });
  toggleSidebar()

}
// 设置容器高度
nextTick(() => {
  containerHeight.value = `${
    stickyRef.value?.$el?.offsetHeight + tabbarRef.value?.$el.offsetHeight
  }px`;
});
</script>

<style lang="scss">
.container {
  --height: v-bind("containerHeight");
  --container-height: calc(100vh - var(--height));
  background-color: #f7f8fa;
  height: calc(100vh - var(--height));
  overflow: auto;
}

/* 侧边栏样式 */
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 70%;
  height: 100%;
  background-color: white;
  z-index: 1000;
  transition: all 0.3s ease;

  .header {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 50px;
    .name {
      margin-top: 10px;
      font-size: 18px;
    }
  }
  .history {
    font-size: 16px;
    margin-top: 25px;
    .title {
      font-weight: bold;
      margin-left: 15px;
      font-size: 25px;
      position: relative;
      // &::before {
      //   content: "";
      //   position: absolute;
      //   left: -5px;
      //   height: 100%;
      //   width: 5px;
      //   background-color: #1989fa;
      // }
    }
  }

  .footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    .logout {
      margin: 10px auto 10px;
      width: 80%;
      border-radius: 25px;
    }
    }
}
</style>
