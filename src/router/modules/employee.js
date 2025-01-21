import layout from '@/layout'
export default {
  path: '/employee',
  component: layout,
  name: 'employee',
  children: [{
    path: '',
    // name: 'employee',
    component: () => import('@/views/employee'),
    meta: {
      title: '员工',
      icon: 'people'
    }
  }, {
    path: '/employee/detail/:id?',
    // name: 'employeeDetail',
    component: () => import('@/views/employee/detail'),
    meta: {
      title: '员工详情'
    },
    hidden: true
  }]
}
