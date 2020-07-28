import VueApollo from 'vue-apollo'
import apolloProvider from '@/config/graphql_apollo'
import App from '@/components/entry.vue';
import Loading from 'vue-loading-overlay';
import Vue from 'vue';

import 'vue-loading-overlay/dist/vue-loading.css';

//Load Plugins
Vue.use(VueApollo)
Vue.use(Loading);

export const vm = new Vue({
    el: '#app',
    render: h => h(App),
    apolloProvider,
});