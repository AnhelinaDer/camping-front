import Vue from 'vue'
import App from './App.vue'
import './assets/tailwind.css' // import tailwind styles
import router from './router'; 
import VCalendar from 'v-calendar';

Vue.use(VCalendar, {
  componentPrefix: 'v',
});

Vue.config.productionTip = false

new Vue({
  router, // add the router instance to the Vue instance
  render: h => h(App),
}).$mount('#app')
