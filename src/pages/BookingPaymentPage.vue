<template>
  <div class="max-w-md mx-auto p-6 bg-white shadow rounded">
    <h2 class="text-2xl font-semibold mb-4">Complete Your Payment</h2>

    <div v-if="error" class="text-red-600 mb-2">{{ error }}</div>

    <!-- Always render the card container, just hide it until stripeReady -->
    <div v-show="stripeReady">
      <form @submit.prevent="handleSubmit">
        <!-- Stripe Card Element -->
        <div id="card-element" class="p-4 border rounded mb-2 h-40"></div>
        <p v-if="cardError" class="text-red-500 text-sm mb-2">{{ cardError }}</p>

        <button
          type="submit"
          :disabled="loading || !clientSecret"
          class="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          <span v-if="loading">Processing…</span>
          <span v-else>Pay {{ currency }} {{ totalPrice }}</span>
        </button>
      </form>
    </div>

    <!-- Loading state while Stripe.js & Elements initialize -->
    <div v-show="!stripeReady" class="text-gray-600">
      Loading payment form…
    </div>

    <p v-if="success" class="mt-4 text-green-700">
      Payment succeeded! Redirecting…
    </p>
  </div>
</template>

<script>
import { loadStripe } from '@stripe/stripe-js';

export default {
  name: 'BookingPaymentPage',
  data() {
    return {
      stripe: null,
      elements: null,
      card: null,

      stripeReady: false,     // defined here
      clientSecret: null,
      totalPrice: 0,
      currency: "", 

      loading: false,
      error: '',
      cardError: '',
      success: false,

      bookingId: this.$route.params.id
    };
  },
  async mounted() {
    try {
      // Initialize Stripe.js by loading the Stripe client with a publishable key.
      // `loadStripe` returns a Promise that resolves to a `stripe` object used for all further calls.
      this.stripe = await loadStripe('pk_test_51RPjS1QrYzMUj3wPc0DnVLuUmlBfWprYMKkHZ5pIOpROYypAx68BxpBPxPeZTBnuzzqwqkPnwWbhd2ofk1E1HgE700D2OeFFzY');
      
      // Create a set of UI components (Elements) tied to the Stripe instance.
      this.elements = this.stripe.elements();

      // Create the “card” Element, which injects a secure, styled credit-card input into the page.
      // passed a `style` object to customize fonts, colors
      this.card = this.elements.create('card', {
        style: { base: { fontSize: '16px', color: '#32325d' } }
      });

      // Mount that card Element into a DOM container with the ID `card-element`
      this.card.mount('#card-element');

      // Wire up real-time validation so any card errors show immediately.
      // The callback fires whenever the user types or the card’s validity changes.
      this.card.on('change', e => {
        // If there’s an error, display its message; otherwise clear any previous error.
        this.cardError = e.error ? e.error.message : '';
      });

      // Fetch booking total and currency
      const bookingRes = await fetch(
        `http://localhost:3000/bookings/${this.bookingId}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      if (!bookingRes.ok) throw new Error('Could not load booking');

      const booking = await bookingRes.json();

      this.totalPrice = booking.totalPrice;
      this.currency   = booking.campingspots.prices[0]?.currency || 'EUR';

      // Create payment intent
      const piRes = await fetch('http://localhost:3000/payments/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ bookingId: this.bookingId })
      });
      if (!piRes.ok) throw new Error('Failed to initialize payment');
      this.clientSecret = (await piRes.json()).clientSecret;

      // Now that element & clientSecret are ready:
      this.stripeReady = true;

    } catch (err) {
      this.error = err.message;
    }
  },
  methods: {
    async handleSubmit() {
      this.loading = true;
      this.error   = '';

      // Confirm payment
      const { error, paymentIntent } = await this.stripe.confirmCardPayment(
        this.clientSecret,
        { payment_method: { card: this.card } }
      );

      if (error) {
        this.error   = error.message;
      } else if (paymentIntent.status === 'succeeded') {
        this.success = true;
        // immediately mark booking paid
        await fetch(
          `http://localhost:3000/bookings/${this.bookingId}/pay`,
          {
            method: 'POST',
            headers: {
              'Content-Type' : 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        setTimeout(() => this.$router.push('/my-bookings'), 1500);
      }

      this.loading = false;
    }
  }
};
</script>
