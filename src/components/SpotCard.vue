<template>
  <router-link :to="{ name: 'CampingSpot', params: { id: spot.spotId } }" class="w-full max-w-sm shadow-md rounded-lg">
    <div class="overflow-hidden rounded-xl">
      <img
        v-if="spot.images && spot.images[0]"
        :src="`http://localhost:3000/spotImages/${spot.images[0].imageURL}` || placeholder"
        alt="Spot Image"
        class="w-full h-48 object-cover"
      />
    </div>

    <div class="flex justify-between items-center text-sm text-gray-500 mt-2 px-1">
      <span class="text-black w-full">{{ spot.name || 'Unknown' }}</span>
      <span class="text-center w-full">{{ spot.cities.name || 'Unknown' }}</span>
      <div class="flex items-center gap-1 text-red-500 text-sm">
        <span class="text-red-500">★</span>
        <span class="text-gray-800 font-medium">{{ avgRating }}</span>
      </div>
    </div>

    <div class="mt-2 text-left font-medium text-lg text-gray-900 px-1">
      {{ formattedPrice }}
    </div>
  </router-link>
</template>

<script>
export default {
  name: 'SpotCard',
  props: {
    spot: {
      type: Object,
      required: true
    }
  },
  computed: {
    // Compute the average rating from the spot’s reviews array
    avgRating() {
      const reviews = this.spot.reviews || [];
      // If no reviews, show a dash
      if (!reviews.length) return '—';
      // Sum up all ratings then divide by count
      const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      // Format to two decimals, replace '.' with ',' for locale
      return avg.toFixed(2).replace('.', ',');
    },
    // Format the price & currency of the first active price record
    formattedPrice() {
      const priceRec = this.spot.prices[0] || {};
      const price    = priceRec.price    !== undefined ? priceRec.price    : '—';
      const currency = priceRec.currency || '€';
      return `${price} ${currency}`;
    },
    // Placeholder image URL used if no images are available
    placeholder() {
      return 'https://via.placeholder.com/400x300?text=No+Image';
    }
  }
};
</script>
