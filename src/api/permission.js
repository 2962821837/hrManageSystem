import request from '@/utils/request'

export const getPermissionList = () => {
  return request({
    url: '/sys/permission'
  })
}

export const addPermission = (data) => {
  return request({
    url: '/sys/permission',
    method: 'post',
    data
  })
}

export const updatePermission = (data) =>
  request({
    url: `/sys/permission/${data.id}`,
    method: 'put',
    data
  })

export const delPermission = (id) =>
  request({
    url: `/sys/permission/${id}`,
    method: 'delete'
  })

