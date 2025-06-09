<template>
  <div class="min-h-screen bg-gray-100">
      <Header />

      <div class="max-w-6xl mx-auto px-4 py-10">
        <div v-if="loading" class="text-center text-gray-600 mt-10">Loading spot details...</div>

        <div v-else-if="error" class="text-center mt-10">
          <p class="text-red-600 text-lg">{{ error }}</p>
          <router-link to="/" class="text-green-600 hover:underline mt-4 inline-block">
            Return to Home
          </router-link>
        </div>

        <div v-else-if="spot" class="space-y-6">
          <!-- Title -->
          <div>
            <h1 class="text-3xl font-bold text-gray-800">{{ spot.name }}</h1>
            <p class="text-gray-500">{{ spot.cities.name }}, {{ spot.cities.countries.name }}</p>
          </div>

          <!-- Images -->
          <div v-if="spot.images && spot.images.length" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <img
              v-for="(img, index) in spot.images"
              :key="index"
              :src="`http://localhost:3000/spotImages/${img.imageURL}`"
              :alt="'Image ' + (index + 1) + ' of ' + spot.name"
              class="rounded-xl w-full h-52 object-cover"
            />
          </div>

          <!-- Description -->
          <p class="text-gray-700">{{ spot.description }}</p>

          <!-- Price -->
          <div v-if="spot.prices && spot.prices[0]" class="text-xl font-semibold text-green-700">
            {{ spot.prices[0].price }} {{ spot.prices[0].currency || '€' }} / night
          </div>

          <!-- Specifications -->
          <div v-if="spot.spotspecifications && spot.spotspecifications.length" class="flex flex-wrap gap-2 text-sm">
            <span
              v-for="spec in spot.spotspecifications"
              :key="spec.specifications.specificationId"
              class="bg-green-100 text-green-800 px-3 py-1 rounded-full"
            >
              {{ spec.specifications.specificationName }}
            </span>
          </div>

          <!-- Book Now -->
          <div v-if="!isOwner" class="mt-6">
            <router-link
              :to="{ name: 'BookSpot', params: { id: spot.spotId } }"
              class="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-semibold"
            >
              Book Now
            </router-link>
          </div>

          <div v-if="isOwner" class="mt-6">
            <router-link
              :to="{ name: 'EditSpot', params: { id: spot.spotId } }"
              class="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-semibold"
            >
              Edit Spot
            </router-link>
          </div>
          
          <!-- Reviews -->
          <div class="mt-10">
            <h2 class="text-2xl font-semibold mb-4">Reviews</h2>
            <div v-if="spot.reviews?.length > 0" class="space-y-4">
              <div
                v-for="(review, i) in spot.reviews"
                :key="i"
                class="bg-white p-4 shadow rounded"
              >
                <p class="font-semibold text-gray-800">{{ review.users.firstName }}</p>
                <p class="text-sm text-gray-500">{{ new Date(review.createdAt).toLocaleDateString() }}</p>
                <p class="text-yellow-500 mt-1">★ {{ review.rating }}</p>
                <p class="mt-2 text-gray-700">{{ review.comment }}</p>
              </div>
            </div>
            <p v-else class="text-gray-500">No reviews yet.</p>
          </div>

          <!-- Map -->
          <SpotMap
            :lat="parseFloat(spot.latitude)"
            :lng="parseFloat(spot.longitude)"
            :popup-text="spot.streetAddress"
            :zoom="14"
          />
          <p class="text-sm text-gray-600">
            {{ spot.cities.name }}, {{ spot.cities.countries.name }}
          </p>
        </div>

      </div>

    <Footer />
  </div>
</template>

<script>
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import SpotMap from '@/components/SpotMap.vue';

export default {
  components: { Header, Footer, SpotMap },
  data() {
    return {
      isOwner: null,
      spot: null,
      loading: true,
      error: null
    };
  },
  async mounted() {
    try {
      const token = localStorage.getItem('token');

      const id = this.$route.params.id;
      const response = await fetch(`http://localhost:3000/spots/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Spot not found');
        }
        throw new Error('Failed to load spot details');
      }

      const data = await response.json();
      if (!data) {
        throw new Error('Spot not found');
      }

      this.spot = data;

      // Check if the user is the owner of the spot
      if (token) {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        this.isOwner = decodedToken.userId === this.spot.ownerId;
      }

    } catch (err) {
      this.error = err.message;
      console.error('Error loading spot:', err);
    } finally {
      this.loading = false;
    }
  },
  beforeRouteUpdate(to, from, next) {
    // Reset state when route params change
    this.spot = null;
    this.loading = true;
    this.error = null;
    next();
  }
};
</script>
