<template>
  <div class="min-h-screen bg-gray-100 flex flex-col">
    <Header />

    <main class="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8 flex-grow">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-semibold">My Camping Spots</h1>
        <router-link
          to="/spots/new"
          class="px-4 py-2 bg-white text-green-700 rounded hover:bg-green-700 hover:text-white transition"
        >
          Add New Spot
        </router-link>
      </div>

      <div v-if="loading" class="text-center py-4">Loading spots...</div>
      <div v-else-if="error" class="text-red-500 text-center py-4">{{ error }}</div>
      <div v-else-if="spots.length === 0" class="text-center py-4">
        You haven't added any camping spots yet.
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="spot in spots"
          :key="spot.spotId"
          class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
        >
          <img
            v-if="spot.images && spot.images[0]"
            :src="`http://localhost:3000/spotImages/${spot.images[0].imageURL}`"
            :alt="spot.name"
            class="w-full h-48 object-cover"
          >
          <div class="p-4">
            <h2 class="text-xl font-semibold mb-2">{{ spot.name }}</h2>
            <p class="text-gray-600 mb-2">{{ spot.description }}</p>
            <p v-if="spot.prices && spot.prices[0]" class="text-lg font-medium mb-4">
               {{ spot.prices[0].price }} {{ spot.prices[0].currency }}/night
            </p>
            <p v-else class="text-lg font-medium mb-4 text-gray-500">
              No price set
            </p>
            
            <div class="flex space-x-2">
              <router-link
                :to="{ name: 'EditSpot', params: { id: spot.spotId }}"
                class="flex-1 px-3 py-2 bg-green-600 text-white text-center rounded hover:bg-green-700 transition"
              >
                Edit
              </router-link>
              <button
                @click="deleteSpot(spot.spotId)"
                class="flex-1 px-3 py-2 bg-red-700 text-white rounded hover:bg-red-800 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
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
      spots: [],
      loading: true,
      error: null
    };
  },
  methods: {
    async deleteSpot(id) {
      if (!confirm('Are you sure you want to delete this camping spot? This action cannot be undone.')) return;

      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3000/spots/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to delete spot.');
        }

        // Remove from list
        this.spots = this.spots.filter(s => s.spotId !== id);
        alert('Camping spot deleted successfully.');
      } catch (err) {
        alert(err.message || 'Something went wrong.');
      }
    }
  },
  async mounted() {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/users/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to load camping spots.');
      }
      
      const data = await response.json();
      this.spots = data.campingspots || [];
    } catch (err) {
      this.error = err.message;
    } finally {
      this.loading = false;
    }
  }
};
</script> 