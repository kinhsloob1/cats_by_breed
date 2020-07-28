import VueApollo from "vue-apollo";
import apolloProvider from "@/config/graphql_apollo";
import App from "@/components/entry.vue";
import Loading from "vue-loading-overlay";
import Vue from "vue";
import Toasted from "vue-toasted";

import "vue-loading-overlay/dist/vue-loading.css";

//Load Plugins
Vue.use(VueApollo);
Vue.use(Loading);

Vue.use(Toasted, {
    position: "bottom-right",
    action: {
        text: "Cancel",
        onClick: (e, toastObject) => {
            toastObject.goAway(0);
        }
    },
    keepOnHover: true,
    duration: 5000,
    singleton: false
});

export const vm = new Vue({
    el: "#app",
    render: h => h(App),
    apolloProvider
});
