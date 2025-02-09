import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
import router from '@/router'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,

  timeout: 20000
})

service.interceptors.request.use((config) => {
  if (store.getters.token) {
    config.headers.Authorization = `Bearer ${store.getters.token}`// 让每个请求携带自定义token 请根据实际情况自行
  }
  return config
}, (error) => {
  return Promise.reject((error))
})

service.interceptors.response.use((response) => {
  if (response.data instanceof Blob) {
    return response.data
  }
  const { data, message, success } = response.data
  if (success) {
    return data
  } else {
    Message({ type: 'error', message })
    return Promise.reject(new Error(message))
  }
}, async(error) => {
  if (error.response.data.message === 401) {
    Message({ type: 'warning', message: 'token超时了' })
    await store.dispatch('user/logout')
    router.push('/login')
    return Promise.reject(error)
  }
  Message({ type: 'error', message: error.message })
  return Promise.reject(error)
})

export default service
