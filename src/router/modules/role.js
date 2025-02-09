import layout from '@/layout'
export default {
  path: '/role',
  component: layout,
  name: 'role',
  children: [{
    path: '',
    // name: 'role',
    component: () => import('@/views/role'),
    meta: {
      title: '角色',
      icon: 'setting'
    }
  }]
}
