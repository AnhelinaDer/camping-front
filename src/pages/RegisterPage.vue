<template>
  <div class="min-h-screen bg-gray-100 flex flex-col justify-between">
    <Header />

    <main class="flex-grow flex items-center justify-center p-4">
      <div class="bg-white p-8 rounded shadow max-w-md w-full">
        <h2 class="text-2xl font-bold text-center mb-6">Create an Account</h2>

        <form @submit.prevent="handleRegister" class="space-y-4">
          <!-- First Name -->
          <div>
            <label class="block text-sm font-medium">First Name</label>
            <input v-model="firstName" type="text" class="form-input" />
            <p v-if="errors.firstName" class="text-sm text-red-500">{{ errors.firstName }}</p>
          </div>

          <!-- Last Name -->
          <div>
            <label class="block text-sm font-medium">Last Name</label>
            <input v-model="lastName" type="text" class="form-input" />
            <p v-if="errors.lastName" class="text-sm text-red-500">{{ errors.lastName }}</p>
          </div>

          <!-- Username -->
          <div>
            <label class="block text-sm font-medium">Username</label>
            <input v-model="username" type="text" class="form-input" />
            <p v-if="errors.username" class="text-sm text-red-500">{{ errors.username }}</p>
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium">Email</label>
            <input v-model="email" type="email" class="form-input" />
            <p v-if="errors.email" class="text-sm text-red-500">{{ errors.email }}</p>
          </div>

          <!-- Password -->
          <div>
            <label class="block text-sm font-medium">Password</label>
            <input v-model="password" type="password" class="form-input" />
            <p v-if="errors.password" class="text-sm text-red-500">{{ errors.password }}</p>
          </div>

          <!-- Birth Date -->
          <div>
            <label class="block text-sm font-medium">Birth Date</label>
            <input v-model="birthDate" type="date" class="form-input" />
          </div>

          <!-- Gender -->
          <div>
            <label class="block text-sm font-medium">Gender</label>
            <select v-model="genderId" class="form-input">
              <option value="" disabled>Select gender</option>
              <option v-for="g in genders" :key="g.genderId" :value="g.genderId">{{ g.gender }}</option>
            </select>
          </div>

          <!-- Submit -->
          <button
            type="submit"
            class="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
          >
            Register
          </button>

          <p class="text-sm text-center mt-3">
            Already have an account?
            <router-link to="/login" class="text-green-600 hover:underline">Sign In</router-link>
          </p>
        </form>
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
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      birthDate: '',
      genderId: '',
      genders: [],
      errors: {}
    };
  },
  mounted() {
    // Fetch gender and role options
    fetch('http://localhost:3000/genders').then(res => res.json()).then(data => this.genders = data);
  },
  methods: {
    validate() {
      const errors = {};
      if (!this.firstName) errors.firstName = 'First name is required';
      if (!this.lastName) errors.lastName = 'Last name is required';
      if (!this.username) errors.username = 'Username is required';
      if (!this.email) errors.email = 'Email is required';
      if (!this.password || this.password.length < 6) errors.password = 'Password must be at least 6 characters';
      this.errors = errors;
      return Object.keys(errors).length === 0;
    },
    async handleRegister() {
      if (!this.validate()) return;

      try {
        const res = await fetch('http://localhost:3000/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firstName: this.firstName,
            lastName: this.lastName,
            username: this.username,
            email: this.email,
            password: this.password,
            birthDate: this.birthDate+"T00:00:00Z",
            genderId: this.genderId,
            roleId: 1 // Default to user role
          })
        });

        const data = await res.json();

        if (res.ok) {
            localStorage.setItem('token', data.token);
            sessionStorage.setItem('justLoggedIn', 'true');
            this.$router.push('/');
        } else {
          this.errors.username = data.message || 'Registration failed.';
        }
      } catch (err) {
        console.error(err);
        this.errors.username = 'Server error. Try again.';
      }
    }
  }
};
</script>

<style scoped>
.form-input {
  @apply w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring focus:border-green-500;
}
</style>
