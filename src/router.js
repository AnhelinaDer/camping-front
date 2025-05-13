import Vue from 'vue';
import VueRouter from 'vue-router';

import HomePage from '@/pages/HomePage.vue';
import LoginPage from '@/pages/LoginPage.vue';
import CampingSpotPage from '@/pages/CampingSpotPage.vue';
import RegisterPage from '@/pages/RegisterPage.vue';
import ProfilePage from './pages/ProfilePage.vue';

Vue.use(VueRouter);

const routes = [
  { path: '/', name: 'Home', component: HomePage },
  { path: '/login', name: 'Login', component: LoginPage },
  { path: '/spots/:id', name: 'CampingSpot', component: CampingSpotPage },
  { path: '/register', name: 'Register', component: RegisterPage },
  { path: '/profile', name: 'Profile', component: ProfilePage },

  // Add more routes here
];

const router = new VueRouter({
  mode: 'history',
  routes
});

export default router;
