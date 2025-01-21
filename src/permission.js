import router from './router'
import nProgress from 'nprogress' // 进度条
import 'nprogress/nprogress.css'
import store from '@/store'
import { asyncRoutes } from './router'

const whiteList = ['/login', '/404'] // 不重定向白名单

router.beforeEach(async(to, from, next) => {
  nProgress.start()
  if (store.getters.token) {
    if (to.path === '/login') {
      next('/')
      nProgress.done()
    } else {
      if (!store.getters.userId) {
        const { roles } = await store.dispatch('user/getUserInfo')
        const filterRoutes = asyncRoutes.filter(item => {
          return roles.menus.includes(item.name)
        })
        store.commit('user/setRoutes', filterRoutes)
        router.addRoutes([...filterRoutes, { path: '*', redirect: '/404', hidden: true }])
        next(to.path)
      } else {
        next()
      }
    }
  } else {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login')
      nProgress.done()
    }
  }
})

router.afterEach(() => {
  nProgress.done()
})
