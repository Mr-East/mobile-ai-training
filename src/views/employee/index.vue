<template>
  <div class="employee-management">
    <!-- 侧边栏 -->
    <van-sidebar v-model="activeTab">
      <van-sidebar-item title="权限管理" />
      <van-sidebar-item title="任务分配" />
      <van-sidebar-item title="场景选择" />
    </van-sidebar>

    <!-- 右侧内容 -->
    <div class="content">
      <!-- 权限管理页面 -->
      <div v-if="activeTab === 0">
        <!-- 新增用户按钮 -->
        <div class="guant-title">
          <span>用户列表</span>
          <van-button type="primary" @click="openAddUserPopup">新增用户</van-button>
        </div>
        <van-cell-group>
          <van-cell
            v-for="(user, index) in users"
            :key="index"
            :title="user.name"
            :label="`角色: ${user.role}`"
          >
            <template #right-icon>
              <!-- 分配权限按钮 -->
              <van-button size="small" type="primary" @click="openAssignRolePopup(user)">
                分配权限
              </van-button>
              <!-- 删除账户按钮 -->
              <van-button size="small" type="danger" @click="deleteUser(user)">
                删除账户
              </van-button>
            </template>
          </van-cell>
        </van-cell-group>
      </div>

      <!-- 任务分配页面 -->
      <div v-if="activeTab === 1">
        <van-cell-group>
          <van-cell
            v-for="(user, index) in users.filter((user) => user.role === '员工')"
            :key="index"
            :title="user.name"
            :label="`角色: ${user.role}`"
          >
            <template #right-icon>
              <!-- 分配任务按钮 -->
              <van-button size="small" type="warning" @click="assignTask(user)">
                分配任务
              </van-button>
            </template>
          </van-cell>
        </van-cell-group>
      </div>

      <div v-if="activeTab === 2">
        <div class="guant-title">
          <span>场景列表</span>
          <van-button type="primary" @click="openAddSessionPopup">新增场景</van-button>
        </div>
        <van-cell-group>
          <van-cell
            v-for="(item, index) in sessionStore.sessions"
            :title="item.name"
            :label="`描述：${item.dec}`"
            :key="index"
          />
        </van-cell-group>
      </div>
    </div>

    <!-- 分配权限的弹出框 -->
    <van-popup v-model:show="showAssignRolePopup" round position="bottom">
      <van-picker
        :columns="columns"
        @cancel="showAssignRolePopup = false"
        @confirm="onRoleConfirm"
      />
    </van-popup>

    <!-- 新增用户的弹出框 -->
    <van-popup v-model:show="showAddUserPopup" round position="bottom">
      <div style="padding: 20px">
        <van-field v-model="newUser.name" label="用户名" placeholder="请输入用户名" />
        <van-field
          v-model="newUser.role"
          label="权限"
          placeholder="请输入权限"
          @click="showPicker = true"
          readonly
          is-link
        />
        <van-popup v-model:show="showPicker" round position="bottom">
          <van-picker
            :columns="columns"
            @confirm="onNewUserRoleConfirm"
            @cancel="showPicker = false"
            title="选择角色"
          />
        </van-popup>
        <van-button type="primary" block @click="addNewUser">添加用户</van-button>
      </div>
    </van-popup>

    <van-popup v-model:show="showSessionPopup" round position="bottom">
      <div style="padding: 20px">
        <van-field
          v-model="newSession.name"
          label="场景名称"
          placeholder="请输入场景名称"
        />
        <van-field
          v-model="newSession.dec"
          label="场景描述"
          placeholder="请输入场景描述"
        />
        <van-button type="primary" block @click="addNewSession">添加场景</van-button>
      </div>
    </van-popup>
    <!-- 分配任务的弹出框 -->
    <van-popup v-model:show="showTask" round>
      <van-field
        v-model="currentUser.name"
       
        readonly
        label="用户名"
        placeholder="选择用户"
        class="home-field"
      />
      <van-field
        v-model="currentSession"
        is-link
        readonly
        label="场景"
        placeholder="选择场景"
        @click="showSessionPicker = true"
        class="home-field"
      />
      <div class="bottom">
        <div class="cancel" @click="showTask = false">取消</div>
        <div class="confirm" @click="assignTaskConfirm">确认</div>
      </div>
    </van-popup>

    <van-popup v-model:show="showSessionPicker" round position="bottom">
      <van-picker
        :columns="sessionStore.sessions.map((item) => ({ text: item.name, value: item.name }))"
        @cancel="showSessionPicker = false"
        @confirm="onSessionPickConfirm"
      />
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { showDialog, showNotify } from "vant";
import { useSessionStore } from "@/store/modules/session";
// 当前激活的侧边栏选项索引
const sessionStore = useSessionStore();
const activeTab = ref(0);
const showPicker = ref(false);
// 用户列表数据

const users = ref([
  { name: "admin", role: "管理员" },
  { name: "张三", role: "员工" },
  { name: "李四", role: "员工" },
  { name: "王五", role: "员工" },
  { name: "赵六", role: "员工" },
]);
const currentSession = ref("");

const showSessionPicker = ref(false);
const onSessionPickConfirm = ({ selectedOptions }) => {
  currentSession.value = selectedOptions[0].text;
  showSessionPicker.value = false;
};
const currentUser = ref({ name: "", role: "" });
const showTask = ref(false);
const showSessionPopup = ref(false);
const newSession = ref({ name: "", dec: "" });
const openAddSessionPopup = () => {
  showSessionPopup.value = true;
};
const assignTaskConfirm = ()=>{
  showNotify({
      type: "success",
      message: "分配任务成功",
    });

    showTask.value  = false
}
const addNewSession = () => {
  if (newSession.value.name && newSession.value.dec) {
    sessionStore.addSession(newSession.value);
    showSessionPopup.value = false;
  } else {
    showNotify({
      type: "warning",
      message: "请输入场景名称和描述",
    });
  }
};
const columns = [
  {
    text: "管理员",
    value: "管理员",
  },
  {
    text: "员工",
    value: "员工",
  },
];

// 分配权限的弹窗控制
const showAssignRolePopup = ref(false);
const selectedUser = ref<any>(null);

// 新增用户的弹窗控制
const showAddUserPopup = ref(false);
const newUser = ref({ name: "", role: "" });

// 打开分配权限的弹出框
const openAssignRolePopup = (user: any) => {
  selectedUser.value = user;
  showAssignRolePopup.value = true;
};

// 处理角色选择确认
const onRoleConfirm = ({ selectedOptions }) => {
  selectedUser.value.role = selectedOptions[0].text;
  showAssignRolePopup.value = false;
};

// 打开新增用户的弹出框
const openAddUserPopup = () => {
  newUser.value = { name: "", role: "" }; // 重置新用户表单
  showAddUserPopup.value = true;
};

// 处理新用户角色选择确认
const onNewUserRoleConfirm = ({ selectedOptions }) => {
  newUser.value.role = selectedOptions[0].text;
  showPicker.value = false;
};

// 添加新用户
const addNewUser = () => {
  if (newUser.value.name && newUser.value.role) {
    users.value.push({ name: newUser.value.name, role: newUser.value.role });
    showAddUserPopup.value = false;
  } else {
    showDialog({
      message: "请输入用户名并选择角色",
    });
  }
};

// 删除用户操作
const deleteUser = (user: { name: string }) => {
  showDialog({
    title: "删除账户",
    message: `你确定要删除 ${user.name} 的账户吗？`,
  })
    .then(() => {
      // 删除逻辑
      users.value = users.value.filter((u) => u.name !== user.name);
      console.log(`${user.name} 的账户已删除`);
    })
    .catch(() => {
      // 取消删除逻辑
    });
};

// 分配任务操作
const assignTask = (user: { name: string }) => {
  showTask.value = true;
  currentUser.value.name = user.name;
};
</script>

<style scoped lang="scss">
.guant-title {
  width: 100%;
  font-size: 16px;
  display: flex;
  justify-content: space-between;
  span {
    display: flex;
    align-items: center;
  }
  .van-button {
    height: 25px;
  }
}
.employee-management {
  display: flex;
}

.van-sidebar {
  width: 150px;
  border-right: 1px solid #ebebeb;
}

.content {
  flex: 1;
  padding: 16px;
}

.van-button {
  margin: 10px 10px;
}

.bottom{
  border-top: 1px solid #ebebeb;
  display: flex;
  padding: 10px;
  font-size: 16px;
  .cancel,
  .confirm{
    flex: 1;
    cursor: pointer;
    text-align: center ;
    transition: color 0.3s ease;
    
    &:hover{
      color: skyblue;
    }
  }
  }

</style>
