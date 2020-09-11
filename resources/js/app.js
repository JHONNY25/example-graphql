/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

window.Vue = require('vue');

import Vuetify from 'vuetify';
import VueApollo from 'vue-apollo'
import ApolloClient from 'apollo-client'
import {createHttpLink} from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import VueSweetalert2 from 'vue-sweetalert2';

const httpLink = createHttpLink({
    // You should use an absolute URL here
    uri: '/graphql',
})

const cache = new InMemoryCache()

const apolloClient = new ApolloClient({
  // You should use an absolute URL here
  link: httpLink,
  cache
})

const apolloProvider = new VueApollo({
    defaultClient: apolloClient,
})

Vue.use(VueSweetalert2);
Vue.use(VueApollo);
Vue.use(Vuetify);

/**
 * The following block of code may be used to automatically register your
 * Vue components. It will recursively scan this directory for the Vue
 * components and automatically register them with their "basename".
 *
 * Eg. ./components/ExampleComponent.vue -> <example-component></example-component>
 */

// const files = require.context('./', true, /\.vue$/i)
// files.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], files(key).default))

Vue.component('view-main', require('./views/Main.vue').default);
Vue.component('table-component', require('./components/TableComponent.vue').default);
Vue.component('modal-component', require('./components/ModalComponent.vue').default);

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

const app = new Vue({
    el: '#app',
    apolloProvider
});
