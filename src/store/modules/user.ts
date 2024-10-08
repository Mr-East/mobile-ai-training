import { defineStore } from 'pinia';
import { Storage } from '@/utils/Storage';
import { reactive } from 'vue';
import{reqAccLogin } from '@/api/user'
import { useRouter } from 'vue-router';
export const useUserStore = defineStore('userStore',()=>{
  
  const userInfo = reactive({
    avatar: '@/assets/user_avatar.png',
    username:'',
    token:'',
    isLogin: false,
    isAdmin: false,
  })

  const userLogin = async (data:any) => {
     const res = await reqAccLogin(data)
     if(res.code === 200){
       userInfo.username = res.data.username
       userInfo.token = res.data.token
       userInfo.isLogin = true
     }
  }
  const userLogOut = ()=>{
    userInfo.username = ''
    userInfo.isAdmin = false
    userInfo.isLogin = false 
  }
  return{
    userInfo,
    userLogOut,
  }
});
