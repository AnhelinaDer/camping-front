<template>
  <div class="min-h-screen flex flex-col bg-gray-100">
    <!-- Header -->
    <Header />

    <!-- Search bar -->
    <section class="bg-green-600 text-white px-6 py-8">
      <div class="max-w-4xl mx-auto grid grid-cols-4 gap-2 bg-white text-black p-4 rounded-xl shadow">
        <input class="col-span-1 border p-2 rounded" placeholder="Where are you going?" />
        <input class="col-span-1 border p-2 rounded" placeholder="Add dates" />
        <input class="col-span-1 border p-2 rounded" placeholder="Add dates" />
        <button class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">🔍</button>
      </div>
      <!-- Tags -->
      <FilterBar :selected="selectedFilters" @toggle-filter="toggleFilter" />
    </section>

    <!-- Spot grid -->
    <main class="flex-1 px-6 py-8">
      <h2 class="text-xl font-semibold mb-6">View spots</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <SpotCard v-for="spot in spots" :key="spot.spotId" :spot="spot" />
      </div>

      <!-- Pagination dots -->
      <div class="flex justify-center mt-6 space-x-2">
        <span class="w-2 h-2 bg-gray-400 rounded-full"></span>
        <span class="w-2 h-2 bg-gray-400 rounded-full"></span>
        <span class="w-2 h-2 bg-green-600 rounded-full"></span>
      </div>
    </main>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import SpotCard from '@/components/SpotCard.vue'
import Footer from '@/components/Footer.vue';
import FilterBar from '@/components/FilterBar.vue';

export default {
  components: { Header, SpotCard, Footer, FilterBar },
  data() {
    return {
      spots: [],
      search: '',
      selectedFilters: [],
      page: 1,
      limit: 10,
      hasMore: true,
      isLoading: false
    };
  },
  methods: {
    buildQuery() {
      const params = new URLSearchParams();
      params.append('page', this.page);
      params.append('limit', this.limit);

      if (this.selectedFilters.length > 0) {
        params.append('specs', this.selectedFilters.join(','));
      }

      return params.toString();
    },
    async resetAndLoad() {
      this.page = 1;
      this.spots = [];
      this.hasMore = true;
      await this.loadMore();
    },
    async loadMore() {
      if (this.isLoading || !this.hasMore) return;
      this.isLoading = true;

      const query = this.buildQuery();
      const res = await fetch(`http://localhost:3000/spots?${query}`);
      const data = await res.json();

      if (data.length < this.limit) this.hasMore = false;
      this.spots.push(...data);
      this.page++;
      this.isLoading = false;
    },
    toggleFilter(id) {
      const index = this.selectedFilters.indexOf(id);
      if (index === -1) {
        this.selectedFilters.push(id);
      } else {
        this.selectedFilters.splice(index, 1);
      }
      this.resetAndLoad(); // fetch spots based on updated filters
    }

  },
  mounted() {
    // Fetch spots from API
    fetch('http://localhost:3000/spots')
      .then(res => res.json())
      .then(data => (this.spots = data));
  }
};
</script>
