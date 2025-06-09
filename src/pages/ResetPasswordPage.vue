<template>
  <div class="min-h-screen flex flex-col bg-gray-100">

    <Header />

    <div class="flex-grow">
        <main class="max-w-sm mx-auto mt-10 p-6 bg-white shadow rounded ">    
            <h1 class="text-xl font-semibold mb-4">Reset Password</h1>
        <form @submit.prevent="submit">
        <input v-model="newPassword"
                type="password"
                placeholder="New password"
                required
                class="w-full border p-2 mb-2" />
        <input v-model="confirm"
                type="password"
                placeholder="Confirm password"
                required
                class="w-full border p-2 mb-2" />
        <button :disabled="loading || newPassword!==confirm"
                class="w-full bg-green-600 text-white p-2 rounded">
            {{ loading ? 'Updating…' : 'Reset Password' }}
        </button>
        </form>
        <p v-if="message" class="mt-4 text-green-700">{{ message }}</p>
        <p v-if="error"   class="mt-2 text-red-600">{{ error }}</p>
        </main>
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
        newPassword: '',
        confirm:     '',
        loading:     false,
        message:     '',
        error:       ''
        };
    },
    computed: {
        token() { return this.$route.params.token; }
    },
    methods: {
        async submit() {
        if (this.newPassword !== this.confirm) return;
        this.loading = true;
        this.error = this.message = '';
        const res = await fetch('http://localhost:3000/passwords/reset-password', {
            method:'POST',
            headers:{ 'Content-Type':'application/json' },
            body: JSON.stringify({
            token: this.token,
            newPassword: this.newPassword
            })
        });
        const data = await res.json();
        if (res.ok) {
            this.message = data.message;
            setTimeout(() => this.$router.push('/login'), 1500);
        } else {
            this.error = data.error;
        }
        this.loading = false;
        }
    }
};
</script>
