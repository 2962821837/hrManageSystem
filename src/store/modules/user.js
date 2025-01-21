import { getToken, setToken, removeToken } from '@/utils/auth'
import { login, getUserInfo } from '@/api/user'
import { constantRoutes } from '@/router'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  userInfo: {},
  routes: constantRoutes
}

const mutations = {
  setToken(state, token) {
    state.token = token
    setToken(token)
  },
  removeToken(state) {
    state.token = null
    removeToken()
  },
  setUserInfo(state, userInfo) {
    state.userInfo = userInfo
  },
  setRoutes(state, newRoutes) {
    state.routes = [...constantRoutes, ...newRoutes]
  }
}

const actions = {
  async login(context, data) {
    // 调用接口
    const token = await login(data)
    context.commit('setToken', token)
  },
  async getUserInfo(context) {
    const result = await getUserInfo()
    context.commit('setUserInfo', result)
    return result
  },
  logout(context) {
    context.commit('removeToken')
    context.commit('setUserInfo', {})
    resetRouter()
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
