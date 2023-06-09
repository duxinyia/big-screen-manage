// 导入设置localstorage的函数
import cache from "@/utils/cache.js"
const state = {
  user: {
    username: "",
    password: "",
    fullName: ""
  }
}
const mutations = {
  SET_USER(state, payload) {
    cache.deleteCache("user")
    cache.setCache("user", payload)
    const { name = "", paw = "", fullName = "" } = payload
    state.user.username = name
    state.user.password = paw
    state.user.fullName = fullName
  }
}
const actions = {}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
