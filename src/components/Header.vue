<template>
  <header class="bg-green-700 text-white px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow">
    <!-- Left: Logo -->
    <div class="flex items-center gap-2">
      <img src="../assets/logo.png" alt="TrueNature" class="h-10 rounded-xl" />
    </div>

    <!-- Center Nav -->
    <nav class="absolute left-1/2 transform -translate-x-1/2 text-sm font-medium">
        <router-link to="/" class="hover:underline cursor-pointer">Places to stay</router-link>
    </nav>

    <!-- Right Side -->
    <div class="flex items-center gap-6 text-sm relative">
        <router-link 
          v-if="isLoggedIn && userRole === 'User'" 
          to="/registerHost" 
          class="hover:underline cursor-pointer"
        >
          Become a host
        </router-link>

      <!-- Auth Area -->
      <div v-if="isLoggedIn" class="relative" @hover="showMenu = true">
        <button
          @click="showMenu = !showMenu"
          class="hover:underline focus:outline-none"
        >
          My Profile ▾
        </button>

        <div
          v-if="showMenu"
          class="absolute right-0 mt-2 bg-white text-black shadow-md rounded w-40 z-50"  @mouseleave="showMenu = false"
        >
          <router-link to="/my-bookings" class="block px-4 py-2 hover:bg-gray-100">My Bookings</router-link>
          <router-link 
            v-if="userRole === 'Owner'" 
            to="/my-spots" 
            class="block px-4 py-2 hover:bg-gray-100"
          >
            My Spots
          </router-link>
          <router-link to="/profile" class="block px-4 py-2 hover:bg-gray-100">Profile</router-link>
          <button @click="logout" class="w-full text-left px-4 py-2 hover:bg-gray-100">Logout</button>
        </div>
      </div>

      <div v-else>
        <router-link to="/login" class="hover:underline">Sign In</router-link>
      </div>
    </div>
  </header>
</template>

<script>
export default {
    name: 'MainHeader',
    data() {
        return {
          isLoggedIn: false,
          showMenu: false,
          userRole: null
        };
    },
    methods: {
        logout() {
          localStorage.removeItem('token');
          this.isLoggedIn = false;
          this.showMenu = false;
          this.userRole = null;
          this.$router.push('/login');
        },
        decodeToken() {
          const token = localStorage.getItem('token');
          if (token) {
            try {
              // Decode the JWT token (get the payload part)
              const base64Url = token.split('.')[1];
              const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
              const payload = JSON.parse(window.atob(base64));
              this.userRole = payload.role;
            } catch (error) {
              console.error('Error decoding token:', error);
              this.userRole = null;
            }
          }
        }
    },
    mounted() {
        const token = localStorage.getItem('token');
        this.isLoggedIn = !!token;
        if (this.isLoggedIn) {
          this.decodeToken();
        }
    },
    watch: {
      // Watch for route changes to update the role
      '$route'() {
        this.decodeToken();
      }
    }
};
</script>
