import request from '@/utils/request';
import {
  loginData,
  userData
} from './type'

enum API {
  USER_LOGIN = '/api/login', // 
  USER_LOGOUT = '/api/logout',
  
}


export const reqAccLogin = (data:loginData)=> request.post<any,any>(API.USER_LOGIN,data)

