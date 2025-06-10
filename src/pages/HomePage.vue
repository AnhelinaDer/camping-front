<template>
  <div class="min-h-screen flex flex-col bg-gray-100">
    <!-- Header -->
    <Header />

    <!-- Welcome message -->
    <div v-if="showWelcome" class="max-w-6xl mx-auto px-4 py-6">
    <div class="bg-green-100 text-green-800 p-4 rounded mb-6 shadow">
      Welcome back!
    </div>
    </div>
    
    <!-- Search bar -->
    <section class="bg-green-600 text-white px-6 py-8">
    <div class="max-w-4xl mx-auto px-4">
      <!-- Search box -->
      <div class="flex overflow-hidden rounded-full shadow-lg bg-white">
        <!-- Input -->
        <input
          v-model="search"
          type="text"
          placeholder="Where are you going?"
          class="flex-1 px-6 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-0"
        />

        <!-- Button -->
        <button
          @click="resetAndLoad"
          class="px-6 flex items-center justify-center bg-white-600 hover:bg-green-700 text-white transition-colors"
        >
          🔍
        </button>
      </div>
      <!-- Tags -->
      <FilterBar :selected="selectedFilters" @toggle-filter="toggleFilter" />
    </div>
    </section>

    <!-- Spot grid -->
    <main class="flex-1 px-6 py-8">
      <h2 class="text-xl font-semibold mb-6">View camping spots</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <SpotCard v-for="spot in spots" :key="spot.spotId" :spot="spot" />
      </div>

      <!-- Load More -->
      <div class="flex justify-center mt-6">
        <button
          v-if="hasMore"
          @click="loadMore"
          :disabled="isLoading"
          class="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          {{ isLoading ? 'Loading…' : 'Load More' }}
        </button>
        <span v-else class="text-gray-500">No more spots to load</span>
      </div>
    </main>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script>
import Header    from '@/components/Header.vue'
import SpotCard  from '@/components/SpotCard.vue'
import Footer    from '@/components/Footer.vue'
import FilterBar from '@/components/FilterBar.vue'

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
      isLoading: false,
      showWelcome: false,
      error: null
    }
  },
  methods: {
    buildQuery() {
      const params = new URLSearchParams()
      params.append('page', this.page)
      params.append('limit', this.limit)

      if (this.search.trim()) {
        params.append('search', this.search.trim())
      }
      if (this.selectedFilters.length) {
        params.append('specs', this.selectedFilters.join(','))
      }
      return params.toString()
    },

    async resetAndLoad() {
      this.page    = 1
      this.spots   = []
      this.hasMore = true
      this.error   = null
      await this.loadMore()
    },

    async loadMore() {
      if (this.isLoading || !this.hasMore) return
      this.isLoading = true
      this.error     = null

      try {
        const query = this.buildQuery()
        const res   = await fetch(`http://localhost:3000/spots?${query}`)
        if (!res.ok) throw new Error('Failed to load spots')
        const data = await res.json()

        // Append & advance page
        this.spots.push(...data)
        // rather than pushing the entire data array as a single item, it “spreads” its elements out 
        // so each one gets pushed individually onto this.spots. That way your spots array grows by each element 
        // of data rather than nesting an array inside it.
        // same as this.spots.push(data[0], data[1], data[2], … etc for each element )
        this.page++

        // If fewer than `limit` came back, no more pages
        if (data.length < this.limit) {
          this.hasMore = false
        }
      } catch (err) {
        this.error = err.message
      } finally {
        this.isLoading = false
      }
    },

    toggleFilter(id) {
      const idx = this.selectedFilters.indexOf(id)
      if (idx === -1) this.selectedFilters.push(id)
      else  this.selectedFilters.splice(idx, 1)
      this.resetAndLoad()
    },

    onSearch() {
      // Called on Enter or search button click
      this.resetAndLoad()
    }
  },

  mounted() {
    // Kick off the first page load
    this.resetAndLoad()

    // Show welcome message if just logged in
    const token = localStorage.getItem('token')
    if (token && sessionStorage.getItem('justLoggedIn')) {
      this.showWelcome = true
      sessionStorage.removeItem('justLoggedIn')
    }
  }
}
</script>

