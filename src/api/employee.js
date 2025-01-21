import request from '@/utils/request'

export function getEmployeeList(params) {
  return request({
    url: '/sys/user',
    method: 'get',
    params
  })
}

export function exportEmployee() {
  return request({
    url: '/sys/user/export',
    responseType: 'blob'
  })
}

export function getExplortTemplate() {
  return request({
    url: '/sys/user/import/template',
    responseType: 'blob'
  })
}
export function uploadExcel(data) {
  return request({
    url: '/sys/user/import',
    method: 'post',
    data
  })
}

export function delEmployee(id) {
  return request({
    url: `/sys/user/${id}`,
    method: 'delete'
  })
}

export function addEmployee(data) {
  return request({
    url: '/sys/user',
    method: 'post',
    data
  })
}

export const getEmployeeDetail = (id) => {
  return request({
    url: `/sys/user/${id}`,
    method: 'get'
  })
}

export function updateEmployee(data) {
  return request({
    url: `/sys/user/${data.id}`,
    method: 'put',
    data
  })
}

export const getEnableRoleList = () =>
  request({
    url: '/sys/role/list/enabled'
  })

export function assignRoles(data) {
  return request({
    url: '/sys/user/assignRoles',
    method: 'put',
    data
  })
}

