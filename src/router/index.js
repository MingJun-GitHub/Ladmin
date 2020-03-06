import Vue from 'vue'
import Router from 'vue-router'
import NProgress from 'nprogress'
import Cookies from 'js-cookie'
import 'nprogress/nprogress.css'
import Home from '../views/index/index'

Vue.use(Router)

const publicTitle = '冷链食品'

const createRoute = () => new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [{
      path: '/',
      name: 'home',
      meta: {
        title: `首页-${publicTitle}`
      },
      component: Home
    },
    {
      name: 'login',
      path: '/login',
      meta: {
        title: '登录'
      },
      component: () => import( /* webpackChunkName: "about" */ '../views/login/index.vue')
    },
    {
      name: 'goods',
      path: '/goods',
      meta: {
        title: '商品列表'
      },
      component: () => import( /* webpackChunkName: "about" */ '../views/goods/index.vue')
    },
    {
      name: 'goodsEdit',
      path: '/goods/edit/:id?',
      meta: {
        title: '商品编辑'
      },
      component: () => import( /* webpackChunkName: "about" */ '../views/goods/edit.vue')
    },
    {
      name: 'goodsClassfiy',
      path: '/goods/classify',
      meta: {
        title: '商品分类'
      },
      component: () => import( /* webpackChunkName: "about" */ '../views/goods/classify.vue')
    },
    {
      name: 'setting',
      path: '/setup',
      meta: {
        title: '支付设置'
      },
      component: () => import( /* webpackChunkName: "about" */ '../views/setup/index.vue')
    },
    {
      name: 'order',
      path: '/order',
      meta: {
        title: '订单列表'
      },
      component: () => import( /* webpackChunkName: "about" */ '../views/order/index.vue')
    },
    {
      name: 'orderDetails',
      path: '/order/details/:id?',
      meta: {
        title: '订单详情'
      },
      component: () => import( /* webpackChunkName: "about" */ '../views/order/details.vue')
    }, {
      name: 'user',
      path: '/user',
      meta: {
        title: '客户列表'
      },
      component: () => import( /* webpackChunkName: "about" */ '../views/user/index.vue')
    }
  ]
})

const router = createRoute()
const whiteList = ['/login'] // 免登录白名单
// 预处理，添加加载状态
router.beforeEach((to, from, next) => {
  if (Cookies.get('token')) {
    NProgress.start()
    document.title = to.meta.title
    if (to.path == '/login') {
      next('/')
      NProgress.done()
    } else {
      next()
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next('/login')
    }
  }
})

// 设置加载（不应该在此设置，应在子组件加载数据完成后调用）
// 将NProgress使用cdn方式
router.afterEach(() => {
  console.log('end-->')
  NProgress.done()
})

export default router