<template>
  <div class="min-h-screen bg-gray-100">
    <Header />

    <main class="max-w-xl mx-auto py-10 px-4">
        <h1 class="text-2xl font-bold text-center mb-6">My Profile</h1>

        <div v-if="user" class="space-y-4 bg-white p-6 rounded shadow">
            <!-- Editable Form -->
            <form @submit.prevent="updateProfile" class="space-y-4">
            <div>
                <label class="block text-sm font-medium">First Name</label>
                <input v-model="user.firstName" class="form-input" type="text" />
            </div>
            <div>
                <label class="block text-sm font-medium">Last Name</label>
                <input v-model="user.lastName" class="form-input" type="text" />
            </div>
            <div>
                <label class="block text-sm font-medium">Email</label>
                <input v-model="user.email" class="form-input" type="email" />
            </div>
            <div>
                <label class="block text-sm font-medium">Birth Date</label>
                <input v-model="user.birthDate" class="form-input" type="date" />
            </div>

            <div>
                <label class="block text-sm font-medium">Gender</label>
                <select v-model="user.genders.genderId" class="form-input">
                    <option disabled value="">Select gender</option>
                    <option v-for="g in genders" :key="g.genderId" :value="g.genderId">
                    {{ g.gender }}
                    </option>
                </select>
            </div>

            <!-- Submit button -->
            <button
                type="submit"
                class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold"
            >
                Save Changes
            </button>
            </form>


            <!-- Delete Account -->
            <div class="mt-6 text-right">
                <button
                    @click="confirmDelete"
                    class="text-red-600 hover:underline text-sm"
                >
                    Delete Account
                </button>
            </div>
        </div>

        <div v-else class="text-center text-gray-600 mt-10">Loading profile...</div>
        <div v-if="successMessage" class="bg-green-100 text-green-800 px-4 py-2 rounded mt-4">
            {{ successMessage }}
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
        user: null,
        successMessage: '',
        genders: []
    };
  },
  mounted() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.$router.push('/login');
      return;
    }

    fetch('http://localhost:3000/users/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        this.user = data;
        this.user.birthDate = new Date(data.birthDate).toISOString().split('T')[0]; // Format date for input
      })
      .catch(err => {
        console.error(err);
        alert('Failed to load profile');
      });

        // Fetch gender options
        fetch('http://localhost:3000/genders')
            .then(res => res.json())
            .then(data => (this.genders = data));
  },
  methods: {
    async updateProfile() {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch('http://localhost:3000/users/me', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            firstName: this.user.firstName,
            lastName: this.user.lastName,
            email: this.user.email,
            birthDate: this.user.birthDate+"T00:00:00Z",
            genderId: this.user.genders.genderId
          })
        });

        if (res.ok) {
            this.successMessage = 'Profile updated successfully!';
            setTimeout(() => (this.successMessage = ''), 3000);
        } else {
          alert('Update failed.');
        }
      } catch (err) {
        console.error(err);
        alert('Error updating profile.');
      }
    },
    confirmDelete() {
      if (confirm('Are you sure you want to delete your account? This cannot be undone.')) {
        this.successMessage = 'Account deleted. Redirecting...';
        this.deleteAccount();
      }
    },
    async deleteAccount() {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch('http://localhost:3000/users/me', {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (res.ok) {
          localStorage.removeItem('token');
          alert('Account deleted');
          this.$router.push('/register');
        } else {
          alert('Failed to delete account.');
        }
      } catch (err) {
        console.error(err);
        alert('Server error.');
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
