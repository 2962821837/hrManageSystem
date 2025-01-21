const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.userInfo.staffPhoto,
  name: state => state.user.userInfo.username,
  userId: state => state.user.userInfo.userId,
  routes: state => state.user.routes,
  company: state => state.user.userInfo.company,
  departmentName: state => state.user.userInfo.departmentName
}
export default getters
