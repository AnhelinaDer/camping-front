<template>
  <div class="w-full max-w-sm shadow-md rounded-lg">
    <div class="overflow-hidden rounded-xl">
      <img
        :src="spot.images?.[0]?.imageURL || placeholder"
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
  </div>
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
    avgRating() {
      const reviews = this.spot.reviews || [];
      if (!reviews.length) return '—';
      const avg =
        reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      return avg.toFixed(2).replace('.', ','); // for 4,98 format
    },
    formattedPrice() {
      const price = this.spot.prices?.[0]?.price || '—';
      const currency = this.spot.prices?.[0]?.currency || '€';
      return `${price} ${currency}`;
    },
    placeholder() {
      return 'https://via.placeholder.com/400x300?text=No+Image';
    }
  }
};
</script>
