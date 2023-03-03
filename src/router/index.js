import Vue from "vue"
import VueRouter from "vue-router"
import routes from "./routes.js"
import NProgress from "nprogress"
import "nprogress/nprogress.css"
import cache from "@/utils/cache.js"
import store from "../store"
// 导入基础的数据
// import { changeCmaConfig, baseShowArr } from "@/assets/data"

let baseShowArr = {
  output: [
    {
      id: 9,
      imgUrl: require("@/assets/images/output.png"),
      title: "年度產出總覽",
      target: "output",
      belong: "管理层/產出",
      isShow: false,
      to: "output"
    },
    {
      id: 11,
      imgUrl: require("@/assets/images/makewar.png"),
      title: "By天產出看板",
      target: "output",
      belong: "管理层/產出",
      isShow: false,
      to: "makewar"
    },
    {
      id: 10,
      imgUrl: require("@/assets/images/output2.png"),
      title: "By站位產出看板",
      target: "output",
      belong: "管理层/產出",
      isShow: false,
      to: "output2"
    },
    {
      id: 10,
      imgUrl: require("@/assets/images/aactga.png"),
      title: "AA/GA/CT",
      target: "output",
      belong: "管理层/產出",
      isShow: false,
      to: "aactga"
    }
  ],
  yield: [
    {
      id: 13,
      imgUrl: require("@/assets/images/sfc.png"),
      title: "SFC良率By月",
      target: "yield",
      belong: "管理层/良率",
      isShow: false,
      to: "sfc"
    },
    {
      id: 14,
      imgUrl: require("@/assets/images/tsfc.png"),
      title: "SFC良率Daily",
      target: "yield",
      belong: "管理层/良率",
      isShow: false,
      to: "tsfc"
    },
    {
      id: 15,
      imgUrl: require("@/assets/images/defect.png"),
      title: "Top 25 Defect",
      target: "yield",
      belong: "管理层/良率",
      isShow: false,
      to: "defect"
    }
  ],
  device: [
    {
      id: 1,
      imgUrl: require("@/assets/images/aa.png"),
      title: "AA設備總覽",
      target: "device",
      belong: "管理层/设备",
      isShow: false,
      to: "aa"
    },
    {
      id: 2,
      imgUrl: require("@/assets/images/fol.png"),
      title: "FOL設備總覽",
      target: "device",
      belong: "管理层/设备",
      isShow: false,
      to: "fol"
    }
  ],
  process: [
    {
      id: 4,
      isExternalLink: true,
      imgUrl: require("@/assets/images/spotcheck.jpg"),
      title: "IAA Step看板",
      target: "device",
      belong: "管理层/製程監控",
      isShow: false,
      to: "http://10.142.117.50:32001/standard/design/#/share/ZC1OY0JP"
    },
    {
      id: 108,
      isExternalLink: true,
      imgUrl: require("@/assets/images/device4.jpg"),
      title: "實時統計",
      target: "process",
      belong: "管理层/製程監控",
      isShow: false,
      to: "http://10.142.117.50:32001/share.html#/?token=KG3RHWT8"
    },
    {
      id: 109,
      isExternalLink: true,
      imgUrl: require("@/assets/images/device5.png"),
      title: "歷史日統計",
      target: "process",
      belong: "管理层/製程監控",
      isShow: false,
      to: "http://10.142.117.50:32001/share.html#/?token=PVAX4VH2"
    },
    {
      id: 110,
      isExternalLink: true,
      imgUrl: require("@/assets/images/device6.png"),
      title: "歷史周統計",
      target: "process",
      belong: "管理层/製程監控",
      isShow: false,
      to: "http://10.142.117.50:32001/share.html#/?token=AMM0V0AE"
    },
    {
      id: 111,
      isExternalLink: true,
      imgUrl: require("@/assets/images/device7.png"),
      title: "歷史月統計",
      target: "process",
      belong: "管理层/製程監控",
      isShow: false,
      to: "http://10.142.117.50:32001/share.html#/?token=YBWWHR2M"
    }
  ]
}

// 目前做好的界面
let nowScreen = [
  "By天產出看板",
  "年度產出總覽",
  "By天產出看板",
  "By站位產出看板",
  "AA/GA/CT",
  "AA設備總覽",
  "FOL設備總覽",
  "SFC良率By月",
  "SFC良率Daily",
  "Top 25 Defect",
  "IAA Step看板",
  "實時統計",
  "歷史日統計",
  "歷史周統計",
  "歷史月統計"
]

// 防止连续点击多次路由报错
const routerPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return routerPush.call(this, location).catch((error) => error)
}
Vue.use(VueRouter)
const router = new VueRouter({
  routes
})
let hasRoles = true
// 用于动态添加路由
router.beforeEach(async (to, from, next) => {
  NProgress.start()
  // 如果去的路由的 login
  if (to.path.includes("login")) {
    if (cache.getCache("user")) {
      next("/overview")
    } else {
      next()
    }
  } else {
    // let accessRoutes = await store.dispatch("permission/GenerateRoutes", {
    //   userJob: store.state.user.user.username,
    //   nickName: store.state.user.user.fullName
    // })
    if (hasRoles) {
      // handleAddRouter(accessRoutes)
      let accessRoutes = await store.dispatch("permission/GenerateRoutes", {
        userJob: store.state.user.user.username,
        nickName: store.state.user.user.fullName
      })
      handleAddRouter(accessRoutes)
      hasRoles = false
      next({ ...to, replace: true })
    } else {
      next()
    }
  }
})
router.afterEach(() => {
  NProgress.done()
})
let menuScreen = []
// 动态添加路由的方法
function handleAddRouter(routers) {
  // 添加路由并且将对应的数据挑选出来
  routers &&
    routers.forEach((item) => {
      // 如果有子组件
      if (item.children) {
        if (nowScreen.includes(item.meta.title)) {
          // 放入新的数组
          menuScreen.push(item.meta.title)
        }
        handleAddRouter(item.children)
      } else {
        // 判断是否在 nowScreen 中
        if (nowScreen.includes(item.meta.title)) {
          // 放入新的数组
          menuScreen.push(item.meta.title)
        }
        // 去menus中找对应的数据 第一次的话将数据保存到vuex
        Object.values(baseShowArr).forEach((item) => {
          item.forEach((item1) => {
            if (menuScreen.includes(item1.title)) {
              item1.isShow = true
            }
          })
        })
        // 将数据提交到vuex 中
        store.commit("permission/SET_SHOWARR", baseShowArr)
      }
    })
}
export default router
