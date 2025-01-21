import request from '@/utils/request'

export const getDepartment = () => {
  return request({
    url: '/company/department'
  })
}

export const getManagerList = () => {
  return request({
    url: '/sys/user/simple'
  })
}

export function addDepartment(data) {
  return request({
    method: 'post',
    url: '/company/department',
    data
  })
}

export const getDepartmentDetail = (id) => {
  return request({
    url: `/company/department/${id}`
  })
}

export const updateDepartment = (data) => {
  return request({
    method: 'put',
    url: `/company/department/${data.id}`,
    data
  })
}

export const deleteDepartment = (id) => {
  return request({
    method: 'delete',
    url: `/company/department/${id}`
  })
}
