import { RouteRecordRaw } from 'vue-router';

export const main: Array<RouteRecordRaw> = [
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/home/index.vue'),
    meta: {
      title: '首页',
      icon: 'home-o',
      hidden: false,
    },
  },
  {
    path: '/user',
    name: 'user',
    component: () => import('@/views/user/index.vue'),
    meta: {
      title: '我的',
      icon: 'user-o',
      hidden: false,
    },
  },
  {
    path: '/chat',
    name: 'chat',
    component: () => import('@/views/chat/index.vue'),
    meta: {
      title: 'AI陪练',
      icon: 'user-o',
      hidden: true,
    },
  },
  {
    path: '/score ',
    name: 'score',
    component: () => import('@/views/score/index.vue'),
    meta: {
      title: '评分反馈',
      hidden: true,
    }
  }
];

export const admin: Array<RouteRecordRaw> = [
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/home/index.vue'),
    meta: {
      title: '首页',
      icon: 'home-o',
      hidden: false,
    },
  },

  {
    path: '/employee',
    name: 'employee',
    component: () => import('@/views/employee/index.vue'),
    meta: {
      title: '员工管理',
      icon: 'friends-o',
      hidden: false,
    },
  },
  {
    path: '/stat',
    name: 'stat',
    component: () => import('@/views/stat/index.vue'),
    meta: {
      title: '数据统计',
      icon: 'chart-trending-o',
      hidden: false,
    },
  },
  {
    path: '/user',
    name: 'user',
    component: () => import('@/views/user/index.vue'),
    meta: {
      title: '我的',
      icon: 'user-o',
      hidden: false,
    },
  },
  {
    path: '/score',
    name: 'score',
    component: () => import('@/views/score/index.vue'),
    meta: {
      title: '评分反馈',
      hidden: true,
    }
  }
];