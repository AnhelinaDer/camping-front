<template>
  <div class="min-h-screen bg-gray-100">
    <Header />

    <main class="max-w-xl mx-auto py-10 px-4">
      <h1 class="text-2xl font-bold text-center mb-6">Book Your Stay</h1>

      <div v-if="spot && availableDates.length" class="bg-white p-6 rounded shadow space-y-6">
        <!-- Spot Info -->
        <div>
          <h2 class="text-xl font-semibold text-gray-800">{{ spot.name }}</h2>
          <p class="text-gray-500">{{ spot.cities.name }}, {{ spot.cities.countries.name }}</p>
          <div class="text-xl font-semibold text-green-700 mt-4">
            {{ pricePerNight }} {{ currency }} / night
            </div>
        </div>

        <!-- Date Picker -->
        <DatePicker
          v-model="dateRange"
          :availableDates="availableDates"
        />


        <!-- Price Calculation -->
        <div class="mt-4 p-4 bg-gray-50 rounded shadow">
          <p><strong>Start Date:</strong> {{ formattedStart }}</p>
          <p><strong>End Date:</strong> {{ formattedEnd }}</p>
          <p><strong>Nights:</strong> {{ numberOfNights }}</p>
          <p><strong>Total Price:</strong> {{ totalPrice }} {{currency}}</p>
        </div>

        <!-- Book Button -->
        <button
          class="mt-4 bg-green-600 text-white px-4 py-2 rounded"
          :disabled="!dateRange.start || !dateRange.end"
          @click="submitBooking"
        >
          Book Now
        </button>
      </div>

      <div v-else class="text-center text-gray-600 mt-10">Loading booking info...</div>
    </main>

    <Footer />
  </div>
</template>

<script>
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import DatePicker from '@/components/DatePicker.vue';

export default {
  components: { Header, Footer, DatePicker },
  data() {
    return {
      spot: null,
      availableDates: [],
      dateRange: { start: null, end: null }, 
      pricePerNight: 0,
      currency: '€'
    };
  },
  computed: {
        formattedStart() {
          return this.dateRange.start ? this.dateRange.start.toISOString().split('T')[0] : '—';
        },
        formattedEnd() {
          return this.dateRange.end ? this.dateRange.end.toISOString().split('T')[0] : '—';
        },
      numberOfNights() {
        if (!this.dateRange.start || !this.dateRange.end) return 0;
        const start = new Date(this.dateRange.start);
        const end = new Date(this.dateRange.end);
        const diffTime = end - start;
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        return diffDays;
      },
      totalPrice() {
        return this.numberOfNights * this.pricePerNight;
      }
  },
  mounted() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.$router.push('/login');
      return;
    }

    const id = this.$route.params.id;
    // Fetch spot info
    fetch(`http://localhost:3000/spots/${id}`)
        .then(res => res.json())
        .then(data => {
            this.spot = data;
            this.pricePerNight = data.prices[0].price || 0;
            this.currency = data.prices[0].currency || '€';

            // Process availability from spot
            this.availableDates = data.spotsavailable
            .filter(d => !d.isBooked)
            .map(d => new Date(d.date).toISOString().split('T')[0]);

    });

  },
  methods: {
    async submitBooking() {
      const token = localStorage.getItem('token');
      const { start, end } = this.dateRange;

      if (!start || !end) {
        alert('Please select a valid date range.');
        return;
      }

      
      try {
        const res = await fetch('http://localhost:3000/bookings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            spotId: parseInt(this.$route.params.id),
            startDate: start,
            endDate: end,
            totalPrice: this.totalPrice,
          })
        });

        if (res.ok) {
          alert('Booking successful!');
          this.$router.push('/my-bookings'); 
        } else {
          const error = await res.json();
          alert(error.message || 'Booking failed.');
        }
      } catch (err) {
        console.error(err);
        alert('Error processing booking.');
      }
    }
  }
};
</script>
