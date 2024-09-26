import { defineStore } from 'pinia';
import { Storage } from '@/utils/Storage';
import { reactive } from 'vue';
import{reqAccLogin } from '@/api/user'
export const useUserStore = defineStore('userStore',()=>{
  
  const userInfo = reactive({
    avatar: '@/assets/user_avatar.png',
    username:'',
    token:'',
    isLogin: false,
  })

  const userLogin = (data:any) => {
    
  }
  return{
    userInfo
  }
});
