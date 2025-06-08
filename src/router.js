import Vue from 'vue';
import VueRouter from 'vue-router';

import HomePage from './pages/HomePage.vue';
import LoginPage from './pages/LoginPage.vue';
import CampingSpotPage from './pages/CampingSpotPage.vue';
import RegisterPage from './pages/RegisterPage.vue';
import ProfilePage from './pages/ProfilePage.vue';
import BookingPage from './pages/BookingPage.vue';
import MyBookingsPage from './pages/MyBookingsPage.vue';
import MySpotsPage from './pages/MySpotsPage.vue';
import NewSpotPage from './pages/NewSpotPage.vue';
import EditSpotPage from './pages/EditSpotPage.vue';

Vue.use(VueRouter);

const routes = [
  { path: '/', name: 'Home', component: HomePage },
  { path: '/login', name: 'Login', component: LoginPage },
  { path: '/register', name: 'Register', component: RegisterPage },
  { path: '/profile', name: 'Profile', component: ProfilePage },
  { path: '/book/:id', name: 'BookSpot', component: BookingPage },
  { path: '/my-bookings', name: 'MyBookings', component: MyBookingsPage},
  { path: '/my-spots', name: 'MySpots', component: MySpotsPage },
  { path: '/spots/new', name: 'NewSpot', component: NewSpotPage },
  { path: '/spots/:id/edit', name: 'EditSpot', component: EditSpotPage },
  { path: '/spots/:id', name: 'CampingSpot', component: CampingSpotPage },

  // Add more routes here
];

const router = new VueRouter({
  mode: 'history',
  routes
});

export default router;
