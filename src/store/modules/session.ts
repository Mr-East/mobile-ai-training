import { defineStore } from 'pinia';
import {  ref } from 'vue'
export const useSessionStore = defineStore('sessionStore', () => {

  const sessions = ref([
    {
      name: '顾客食品品质问题',
      dec:'顾客食品品质有问题，有头发丝或飞虫，需要解决',
    },
    {
      name: '卫生环境服务问题',
      dec:'门店卫生清洁不到位，需要解决',

    },
    {
      name: '顾客餐点有遗漏',
      dec:'顾客菜单少上漏上，需要解决',

    },
    
  ]);

  const addSession = ({name,dec}) => {
    sessions.value.push({
      name: name,
      dec: dec,
    })
  }
  return {
    sessions,
    addSession,
  }
});
