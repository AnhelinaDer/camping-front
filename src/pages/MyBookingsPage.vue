<template>
  <div class="min-h-screen bg-gray-100 flex flex-col">
    <Header />

    <main class="max-w-xl py-10 px-10 flex-grow">

        <!-- Upcoming Bookings -->
        <h1 class="text-2xl font-semibold mb-4">My Upcoming Bookings</h1>
        <div v-if="loadingUpcoming" class="text-gray-600">Loading…</div>
        <div v-else-if="upcomingBookings.length === 0" class="mb-8">
            No upcoming bookings.
        </div>
        <div v-else class="mb-8">
            <div
            v-for="b in upcomingBookings"
            :key="b.bookingId"
            class="p-4 mb-4 border border-gray-200 rounded shadow-sm bg-white"
            >
            <router-link
                :to="{ name: 'CampingSpot', params: { id: b.campingspots.spotId } }"
                class="text-lg font-medium"
            >{{ b.campingspots.name }}</router-link>
            <p class="mt-1">
                🗓️
                {{ formatDate(b.startDate) }}
                –
                {{ formatDate(b.endDate) }}
            </p>
            <p class="mt-1">
                🏕️ Nights:
                {{ diffDays(b.startDate, b.endDate) }}
            </p>
            <p class="mt-1 font-semibold">
                💶 Total:
                {{ b.totalPrice }} {{ b.campingspots.prices[0].currency }}
            </p>
            <button
                @click="cancelBooking(b.bookingId)"
                class="mt-3 px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
            >
                Cancel
            </button>
            </div>
        </div>

        <!-- Past Bookings -->
        <h1 class="text-2xl font-semibold mb-4">My Past Bookings</h1>
        <div v-if="loadingPast" class="text-gray-600">Loading…</div>
        <div v-else-if="pastBookings.length === 0">
            You have no past bookings yet.
        </div>
        <div v-else>
            <div
            v-for="b in pastBookings"
            :key="b.bookingId"
            class="p-4 mb-4 border border-gray-200 rounded shadow-sm bg-white"
            >
            <router-link
                :to="{ name: 'CampingSpot', params: { id: b.campingspots.spotId } }"
                class="text-lg font-medium"
            >{{ b.campingspots.name }}</router-link>
            <p class="mt-1">🗓️ {{ formatDate(b.startDate) }} - {{ formatDate(b.endDate) }}</p>
            <p class="mt-1 font-semibold">💶 {{ b.totalPrice }} {{ b.campingspots.prices[0].currency }}</p>

            <!-- If the user has already left a review -->
            <div v-if="b.reviews.length>0" class="relative  mt-3 p-3 bg-green-50 rounded">
                <p class="font-medium">Your Review:</p>
                <p>⭐ {{ b.reviews[0].rating }} / 5</p>
                <p class="italic">“{{ b.reviews[0].comment }}”</p>
                <!-- Delete Review button -->
                <button @click="deleteReview(b.bookingId, b.reviews[0].reviewId)"
                    class="absolute top-2 right-2 text-red-600 hover:text-red-800 text-sm"
                    title="Delete this review" >
                    Delete
                </button>
            </div>

            <!-- Otherwise show “Leave Review” button -->
            <div v-else class="mt-3">
                <button
                v-if="!showReviewForm[b.bookingId]"
                @click="showReviewFormToggle(b.bookingId, true)"
                class="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Leave a Review
                </button>

                <div v-else class="mt-2 space-y-2">
                <textarea
                    v-model="reviewText[b.bookingId]"
                    rows="2"
                    placeholder="Your comments…"
                    class="w-full border-gray-300 rounded p-2"
                ></textarea>
                <div class="flex items-center space-x-2">
                    <label class="text-sm">Rating:</label>
                    <select v-model.number="reviewRating[b.bookingId]" class="border rounded p-1">
                    <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
                    </select>
                </div>
                <div class="flex space-x-2">
                    <button
                    @click="submitReview(b)"
                    :disabled="submitting[b.bookingId]"
                    class="flex-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                    >
                    {{ submitting[b.bookingId] ? 'Saving…' : 'Submit Review' }}
                    </button>
                    <button
                    @click="showReviewFormToggle(b.bookingId, false)"
                    class="flex-1 px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                    >
                    Cancel
                    </button>
                </div>
                </div>
            </div>
            </div>
        </div>
    </main>

    <Footer />
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'

export default {
  components: { Header, Footer },
  data() {
    return {
      bookings: [],
      loadingUpcoming: true,
      loadingPast: true,
      error: null,
      showReviewForm: {},
      reviewText: {},
      reviewRating: {},
      submitting: {}
    }
  },
  computed: {
    today() {
      return new Date().setHours(0, 0, 0, 0)
    },
    upcomingBookings() {
      return this.bookings.filter(
        b => new Date(b.endDate).getTime() >= this.today
      )
    },
    pastBookings() {
      return this.bookings.filter(
        b => new Date(b.endDate).getTime() < this.today
      )
    }
  },
  methods: {
    formatDate(d) {
      return new Date(d).toISOString().split('T')[0]
    },
    diffDays(a, b) {
      const ms = new Date(b) - new Date(a)
      return ms / (1000 * 60 * 60 * 24)
    },
    showReviewFormToggle(id, val) {
        // ensure reactivity:
        this.$set(this.showReviewForm, id, val);
    },
    async deleteReview(bookingId, reviewId) {
        if (!confirm('Are you sure you want to delete your review?')) return;

        this.submitting = { ...this.submitting, [reviewId]: true };
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:3000/reviews/${reviewId}`, {
                method: 'DELETE',
                headers: {
                Authorization: `Bearer ${token}`
                }
            });
            if (!res.ok) throw new Error('Failed to delete review');

            // Remove the review from that booking in local state
            this.bookings = this.bookings.map(b =>
                b.bookingId === bookingId
                ? { ...b, review: null }
                : b
            );
            alert('Review deleted.');
        } catch (err) {
            alert(err.message || 'Could not delete review.');
        } finally {
            this.submitting = { ...this.submitting, [reviewId]: false };
            this.fetchBookings(); // Refresh bookings to ensure state is up-to-date
        }
    },
    async cancelBooking(id) {
        if (!confirm('Cancel this booking?')) return
      
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:3000/bookings/${id}`, {
                    method: 'DELETE',
                    headers: {
                    'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to cancel booking.');
                }

                // Remove from list
                this.bookings = this.bookings.filter(b => b.bookingId !== id);
                alert('Booking cancelled.');
                // Reload page
                this.fetchBookings();
            } catch (err) {
                alert(err.message || 'Something went wrong.');
            }
    },
    async submitReview(booking) {
      const id = booking.bookingId
      this.submitting = { ...this.submitting, [id]: true }
      try {
        const token = localStorage.getItem('token')
        const res = await fetch('http://localhost:3000/reviews', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            spotId: booking.campingspots.spotId,
            bookingId: id,
            comment: this.reviewText[id],
            rating: this.reviewRating[id]
          })
        })
        if (!res.ok) throw new Error('Failed to save review')
        const saved = await res.json()
        // attach to booking so we no longer show the form
        this.bookings = this.bookings.map(b =>
          b.bookingId === id ? { ...b, review: saved } : b
        )
        this.showReviewForm[id] = false
      } catch (err) {
        alert(err.message)
      } finally {
        this.submitting = { ...this.submitting, [id]: false }
        this.fetchBookings();
      }
    },
    async fetchBookings() {
        try {
            const token = localStorage.getItem('token')
            const res   = await fetch('http://localhost:3000/users/me', {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (!res.ok) throw new Error('Failed to load bookings')
            const data = await res.json()
            this.bookings = data.bookings || []
        } catch (err) {
            this.error = err.message
        } finally {
            this.loadingUpcoming = this.loadingPast = false
        }
    }
  },
  async mounted() {
    this.fetchBookings();
  }
}
</script>
