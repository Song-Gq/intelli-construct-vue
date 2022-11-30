// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios'

Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.prototype.$axios = axios
let targetDomain = 'https://x.gqsong.xyz:443'
// let targetDomain = 'http://localhost:5001'
Vue.prototype.$targetDomain = targetDomain

// axios.defaults.baseURL='/api'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  axios,
  targetDomain,
  router,
  components: { App },
  template: '<App/>'
})
