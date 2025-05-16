<template>
  <div class="min-h-screen bg-gray-100 flex flex-col">
    <Header />

    <main class="max-w-xl py-10 px-10 flex-grow">
        <h1 class="text-2xl font-semibold mb-4">My Bookings</h1>

        <div v-if="loading">Loading bookings...</div>
        <div v-else-if="error" class="text-red-500">{{ error }}</div>
        <div v-else-if="bookings.length === 0">No bookings yet.</div>

        <div v-else>
            <div
                v-for="booking in bookings"
                :key="booking.bookingId"
                class="p-4 mb-4 border border-gray-200 rounded shadow-sm bg-white"
            >
                <router-link :to="{ name: 'CampingSpot', params: { id: booking.campingspots.spotId } }" class="text-lg font-medium">{{ booking.campingspots.name }}</router-link>
                <p class="mt-1">🗓️ {{ new Date(booking.startDate).toISOString().split('T')[0] }} - {{ new Date(booking.endDate).toISOString().split('T')[0] }}</p>
                <p class="mt-1">🏕️ Total number of nights: {{ (new Date(booking.endDate) - new Date(booking.startDate))/ (1000 * 60 * 60 * 24) }} </p>
                <p class="mt-1 font-semibold">💶 Total: {{ booking.totalPrice }} {{ booking.campingspots.prices[0].currency }}</p>
            
                <button
                    @click="cancelBooking(booking.bookingId)"
                    class="mt-3 px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                >
                    Cancel
                </button>
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
        bookings: [],
        loading: true,
        error: null
        };
    },
    methods: {
        async cancelBooking(id) {
            if (!confirm('Are you sure you want to cancel this booking?')) return;

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
                throw new Error('Failed to load bookings.');
            }
            
            const data = await response.json();
            this.bookings = data.bookings || [];
        } catch (err) {
            this.error = err.message;
        } finally {
            this.loading = false;
        }
    }
};
</script>
