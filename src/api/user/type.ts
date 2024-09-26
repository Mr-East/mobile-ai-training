export interface loginData{
  username: string
  password: string
}

export interface userData {
  id: number | string
  username: string
  token: string
  avatar?: string
  isAdmin: number 
  company: string
 
}