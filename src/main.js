import Vue from 'vue'
import Antd from 'ant-design-vue';
import App from './App.vue'
import VueMask from 'v-mask'
import router from './router';
import { Button, Tag, Icon, message } from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

Vue.config.productionTip = false



Vue.use(VueMask)
Vue.use(Antd);
Vue.use(Button);
Vue.use(Tag);
Vue.use(message);
Vue.use(Icon);




new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
