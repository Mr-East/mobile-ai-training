import { defineStore } from 'pinia';
import {  ref } from 'vue'
export const useSessionStore = defineStore('sessionStore', () => {

  const sessions = ref([
    {
      name: '场景1',
      dec:'场景1的描述',
    },
    {
      name: '场景2',
      dec:'场景2的描述',

    },
    {
      name: '场景3',
      dec:'场景3的描述',

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
