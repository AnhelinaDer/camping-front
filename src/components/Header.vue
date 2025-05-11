<template>
  <header class="bg-green-700 text-white px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow">
    <!-- Left: Logo -->
    <div class="flex items-center gap-2">
      <img src="../assets/logo.png" alt="TrueNature" class="h-8" />
      <span class="text-lg font-semibold">TrueNature</span>
    </div>

    <!-- Center Nav -->
    <nav class="absolute left-1/2 transform -translate-x-1/2 text-sm font-medium">
      <span class="hover:underline cursor-pointer">Places to stay</span>
    </nav>

    <!-- Right Side -->
    <div class="flex items-center gap-6 text-sm relative">
      <button class="hover:underline">Become a Host</button>

      <!-- Auth Area -->
      <div v-if="isLoggedIn" class="relative" @mouseleave="showMenu = false">
        <button
          @click="showMenu = !showMenu"
          class="hover:underline focus:outline-none"
        >
          My Profile ▾
        </button>

        <div
          v-if="showMenu"
          class="absolute right-0 mt-2 bg-white text-black shadow-md rounded w-40 z-50"
        >
          <router-link to="/bookings" class="block px-4 py-2 hover:bg-gray-100">My Bookings</router-link>
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
      showMenu: false
    };
  },
  mounted() {
    this.isLoggedIn = !!localStorage.getItem('token'); // Or use Vuex
  },
  methods: {
    logout() {
      localStorage.removeItem('token');
      this.isLoggedIn = false;
      this.showMenu = false;
      this.$router.push('/login');
    }
  }
};
</script>
