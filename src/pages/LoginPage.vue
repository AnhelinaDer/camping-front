<template>
  <div class="min-h-screen flex flex-col justify-between bg-gray-100">
    <Header />

    <main class="flex flex-col items-center justify-center flex-grow px-4">
      <div class="max-w-md w-full bg-white shadow-md rounded p-8">
        <h2 class="text-2xl font-bold text-center mb-6">Login to your account</h2>

        <form @submit.prevent="handleLogin" class="space-y-5">
          <!-- Username -->
          <div>
            <label class="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              v-model.trim="username"
              class="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring focus:border-green-500"
              placeholder="Enter username"
            />
            <p v-if="errors.username" class="text-red-600 text-sm mt-1">{{ errors.username }}</p>
          </div>

          <!-- Password -->
          <div>
            <label class="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              v-model.trim="password"
              class="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring focus:border-green-500"
              placeholder="Enter password"
            />
            <p v-if="errors.password" class="text-red-600 text-sm mt-1">{{ errors.password }}</p>
          </div>

          <!-- General error -->
          <p v-if="errors.general" class="text-red-600 text-sm text-center">{{ errors.general }}</p>

          <!-- Submit -->
          <button
            type="submit"
            class="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded font-semibold"
          >
            Sign in
          </button>
        </form>

        <p class="text-sm text-center mt-4">
          Don't have an account?
          <router-link to="/register" class="underline font-medium">Register</router-link>
        </p>
      </div>
    </main>

    <Footer />
  </div>
</template>

<script>
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';

export default {
  components: { Header, Footer },
  data() {
    return {
      username: '',
      password: '',
      errors: {}
    };
  },
  methods: {
    validate() {
      const errors = {};
      if (!this.username) errors.username = 'Username is required';
      else if (this.username.length < 3) errors.username = 'Username must be at least 3 characters';

      if (!this.password) errors.password = 'Password is required';
      else if (this.password.length < 3) errors.password = 'Password must be at least 3 characters';

      this.errors = errors;
      return Object.keys(errors).length === 0;
    },
    async handleLogin() {
      if (!this.validate()) return;

      try {
        const response = await fetch('http://localhost:3000/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: this.username,
            password: this.password
          })
        });

        const data = await response.json();

        if (data.token) {
          localStorage.setItem('token', data.token);
          sessionStorage.setItem('justLoggedIn', 'true');
          this.$router.push('/');
        } else {
          this.errors.general = 'Invalid username or password';
        }
      } catch (err) {
        console.error(err);
        this.errors.general = 'Login failed. Please try again later.';
      }
    }
  }
};
</script>
