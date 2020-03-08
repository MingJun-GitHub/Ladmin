import Vue from 'vue'
import App from './App.vue'
import router from '@/router'
import store from '@/store'
import axios from 'axios'
import cookie from 'js-cookie'
import iView from 'iview'
import mixin from '@/utils/mixin'
import 'iview/dist/styles/iview.css'

import '@/style/global.scss'

axios.interceptors.request.use(config => {
  // console.log('config', config)
  config.headers = {
    token: cookie.get('token'),
    'Content-Type': config.headers['Content-Type'] || 'application/json'
  }
  return config
}, error => {
  return Promise.reject(error)
})

// http response 拦截器
axios.interceptors.response.use(
  response => {
    return response.data
  },
  //接口错误状态处理，也就是说无响应时的处理
  error => {
    if (error.response.status===401) {
      cookie.remove('token')
      // console.log('router-->', router, error.response.status)
      router.replace({
        path: '/login'
      })
    }
    return Promise.reject(error) // 返回接口返回的错误信息
  })


Vue.config.productionTip = false
Vue.prototype.$axios=axios
Vue.prototype.$cookie=cookie
Vue.use(iView)
Vue.mixin(mixin)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')