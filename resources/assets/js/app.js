import VueApollo from 'vue-apollo'
import apolloProvider from '@/config/graphql_apollo'
import App from '@/components/entry.vue';
import Loader from 'vue-loading-overlay';
import Vue from 'vue';

//Load Plugins
Vue.use(VueApollo)
Vue.use(Loader);

export const vm = new Vue({
    el: '#app',
    render: h => h(App),
    apolloProvider,
});