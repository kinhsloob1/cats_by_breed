import VueApollo from 'vue-apollo';
import apolloProvider from '@/config/graphql_apollo';
import App from '@/components/entry.vue';
import Vue from 'vue';
import vSelect from 'vue-select';
import { ToastPlugin } from 'bootstrap-vue';

Vue.use(ToastPlugin);

//Load plugins
Vue.use(VueApollo);

Vue.component('v-select', vSelect);

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import 'vue-select/dist/vue-select.css';

export const vm = new Vue({
  el: '#app',
  render: h => h(App),
  apolloProvider
});
