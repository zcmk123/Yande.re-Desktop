import Vue from 'vue'
import axios from 'axios'
import ElementUI from 'element-ui'

// import i18n modules
import VueI18n from 'vue-i18n'
import elementEnLang from 'element-ui/lib/locale/lang/en'
import elementZhLang from 'element-ui/lib/locale/lang/zh-CN'

import zhLang from './lang/zh-CN'
import enLang from './lang/en-US'

// import element-ui css
import 'element-ui/lib/theme-chalk/index.css'

import App from './App'
import router from './router'
import store from './store'

import convert from 'xml-js'
import lodash from 'lodash'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.use(VueI18n)
Vue.use(ElementUI, {
	i18n: (key, value) => i18n.t(key, value)
})
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

const messages = {
	zh: {
		...zhLang,
		...elementZhLang
	},
	en: {
		...enLang,
		...elementEnLang
	}
}

// Create VueI18n instance with options
const i18n = new VueI18n({
  locale: 'en', // set locale
  messages, // set locale messages
})

// axios config
window.axios = axios
window.convert = convert
window._ = lodash
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
window.axios.defaults.withCredentials = true

/* eslint-disable no-new */
new Vue({
  components: { App },
  i18n,
  router,
  store,
  template: '<App/>'
}).$mount('#app')
