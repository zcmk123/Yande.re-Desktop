import Vue from 'vue'
import axios from 'axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import App from './App'
import router from './router'
import store from './store'

import convert from 'xml-js'
import lodash from 'lodash'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.use(ElementUI)
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

// axios config
window.axios = axios
window.convert = convert
window._ = lodash
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
window.axios.defaults.withCredentials = true

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
