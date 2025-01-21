import request from '@/utils/request'

export const getRoleList = (params) => {
  return request({
    url: '/sys/role',
    params
  })
}

export const addRole = (data) => {
  return request({
    url: '/sys/role',
    method: 'post',
    data
  })
}

export const updateRole = (data) => {
  return request({
    url: `/sys/role/${data.id}`,
    method: 'put',
    data
  })
}

export const delRole = (id) => {
  return request({
    url: `/sys/role/${id}`,
    method: 'delete'
  })
}

export function getRoleDetail(id) {
  return request({
    url: `/sys/role/${id}`
  })
}

export function assignPerm(data) {
  return request({
    url: '/sys/role/assignPrem',
    method: 'put',
    data
  })
}
