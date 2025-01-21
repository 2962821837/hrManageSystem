import request from '@/utils/request'

export function getHomeData() {
  return request({
    url: 'home/data'
  })
}

export function getMessageList() {
  return request({
    url: '/home/notice'
  })
}
