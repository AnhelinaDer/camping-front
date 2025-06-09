// Import Vue core
import Vue from 'vue'

// Import the root component
import App from './App.vue'

// Import Tailwind’s CSS so I can use its utility classes in my templates
import './assets/tailwind.css'

// Import Vue Router instance (defines all page routes)
import router from './router'

// Import V-Calendar (for datepickers & calendars)
import VCalendar from 'v-calendar'

// Import Leaflet Vue components for rendering interactive maps
import { LMap, LTileLayer, LMarker, LPopup } from 'vue2-leaflet'
// And Leaflet’s default stylesheet (pins, controls, etc.)
import 'leaflet/dist/leaflet.css'

// Import the Leaflet library itself so I can override its default icon URLs
import L from 'leaflet'

/*
  Leaflet by default tries to load marker images from a URL
  like '/marker-icon.png'. When I bundle with Webpack, that
  path doesn’t exist. So I delete the old URL getter…
*/
delete L.Icon.Default.prototype._getIconUrl

/*
  …and tell Leaflet exactly where to find its images in node_modules.
  The require() calls ensure Webpack bundles these files and returns
  the correct URL at runtime.
*/
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl:       require('leaflet/dist/images/marker-icon.png'),
  shadowUrl:     require('leaflet/dist/images/marker-shadow.png'),
})

/*
  Globally register the Vue2-Leaflet components so I can
  use <l-map>, <l-tile-layer>, <l-marker>, and <l-popup>
  anywhere in my templates without importing them each time.
*/
Vue.component('l-map', LMap)
Vue.component('l-tile-layer', LTileLayer)
Vue.component('l-marker', LMarker)
Vue.component('l-popup', LPopup)

/*
  Install V-Calendar as a plugin.
  The `componentPrefix: 'v'` option means you can use
  <v-date-picker> and <v-calendar> in the templates.
*/
Vue.use(VCalendar, {
  componentPrefix: 'v'
})

// Disable the production tip in the console
Vue.config.productionTip = false

/*
  Create the root Vue instance:
   inject the router so <router-view> works
   render the App.vue component as the top‐level UI
   mount the whole app to the <div id="app"> in index.html
*/
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
