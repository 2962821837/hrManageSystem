import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}

export const getUserInfo = () =>
  request({
    url: '/sys/profile'
  })

export const updatePassword = (data) => {
  return request({
    url: '/sys/user/updatePass',
    method: 'put',
    data
  })
}

export function addDepartment(data) {
  return request({
    method: 'post',
    url: '/company/department',
    data
  })
}
