<template>
  <div class="min-h-screen bg-gray-100">
    <Header />

    <div class="max-w-6xl mx-auto px-4 py-10">
      <div v-if="spot" class="space-y-6">
        <!-- Title -->
        <div>
          <h1 class="text-3xl font-bold text-gray-800">{{ spot.name }}</h1>
          <p class="text-gray-500">{{ spot.cities.name }}, {{ spot.cities.countries.name }}</p>
        </div>

        <!-- Images -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <img
            v-for="(img, index) in spot.images"
            :key="index"
            :src="require('@/assets/spotImages/' + img.imageURL)"
            alt="Spot Image"
            class="rounded-xl w-full h-52 object-cover"
          />
        </div>

        <!-- Description -->
        <p class="text-gray-700">{{ spot.description }}</p>

        <!-- Price -->
        <div class="text-xl font-semibold text-green-700">
          {{ spot.prices[0].price }} {{ spot.prices[0].currency || '€' }} / night
        </div>

        <!-- Specifications -->
        <div class="flex flex-wrap gap-2 text-sm">
          <span
            v-for="spec in spot.spotspecifications"
            :key="spec.specifications.specificationId"
            class="bg-green-100 text-green-800 px-3 py-1 rounded-full"
          >
            {{ spec.specifications.specificationName }}
          </span>
        </div>

        <!-- Book Now -->
        <div class="mt-6">
          <router-link
            :to="{ name: 'BookSpot', params: { id: spot.spotId } }"
            class="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-semibold"
          >
            Book Now
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
      </div>

      <div v-else class="text-center text-gray-600 mt-10">Loading spot details...</div>
    </div>

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
      spot: null
    };
  },
  mounted() {
    const id = this.$route.params.id;
    fetch(`http://localhost:3000/spots/${id}`)
      .then(res => res.json())
      .then(data => (this.spot = data))
      .catch(err => {
        console.error(err);
        alert('Failed to load spot.');
      });
  }
};
</script>
