<template>
  <div class="min-h-screen bg-gray-100 flex flex-col">
        <Header />

        <main class="flex-1 p-6">
            <h1 class="text-3xl font-bold mb-4">Admin Dashboard</h1>

            <!-- tabs -->
            <nav class="flex space-x-6 border-b border-gray-300 pb-2 mb-6">
                <button
                v-for="tab in tabs"
                :key="tab"
                @click="currentTab = tab"
                :class="tab === currentTab
                    ? 'border-b-2 border-green-600 text-green-600'
                    : 'text-gray-600 hover:text-green-600'"
                class="pb-1 font-medium"
                >
                {{ tab }}
                </button>
            </nav>

            <div v-if="currentTab==='Users'">
                <table class="w-full text-left">
                    <thead><tr>
                    <th>ID</th><th>Username</th><th>Email</th><th>Role</th><th>Active?</th>
                    </tr></thead>
                    <tbody>
                    <tr v-for="u in users" :key="u.userId">
                        <td>{{ u.userId }}</td>
                        <td>{{ u.username }}</td>
                        <td>{{ u.email }}</td>
                        <td>{{ u.roles.roleName }}</td>
                        <td>{{ u.isActive ? 'No' : 'Yes' }}</td>
                    </tr>
                    </tbody>
                </table>
            </div>

            <div v-else-if="currentTab==='Spots'">
                <table class="w-full text-left">
                    <thead><tr>
                    <th>ID</th><th>Name</th><th>Owner</th><th>City</th><th>Price</th>
                    </tr></thead>
                    <tbody>
                    <tr v-for="s in spots" :key="s.spotId">
                        <td>{{ s.spotId }}</td>
                        <td>{{ s.name }}</td>
                        <td>{{ s.users.firstName }} {{ s.users.lastName }}</td>
                        <td>{{ s.cities.name }}</td>
                        <td>{{ s.prices[0].price }} {{ s.prices[0].currency }}</td>
                    </tr>
                    </tbody>
                </table>
            </div>

            <div v-else-if="currentTab==='Bookings'">
                <table class="w-full text-left">
                    <thead><tr>
                    <th>ID</th><th>User</th><th>Spot</th><th>Dates</th><th>Status</th><th>Review?</th>
                    </tr></thead>
                    <tbody>
                    <tr v-for="b in bookings" :key="b.bookingId">
                        <td>{{ b.bookingId }}</td>
                        <td>{{ b.users.firstName }} {{ b.users.lastName }}</td>
                        <td>{{ b.campingspots.name }}</td>
                        <td>{{ formatDate(b.startDate) }} → {{ formatDate(b.endDate) }}</td>
                        <td>{{ b.bookingstatus.statusName }}</td>
                        <td>{{ b.reviews.length ? 'Yes' : 'No' }}</td>
                    </tr>
                    </tbody>
                </table>
            </div>

            <div v-else-if="currentTab==='Amenities'">
                <div class="mb-4 flex space-x-2">
                    <input v-model="newSpec" placeholder="New amenity name"
                        class="border p-2 flex-1"/>
                    <button @click="addSpec"
                            class="bg-green-600 text-white px-4 rounded">Add</button>
                </div>
                <ul class="space-y-2">
                    <li v-for="spec in specs" :key="spec.specificationId" class="flex justify-between">
                    {{ spec.specificationName }}
                    <button @click="delSpec(spec.specificationId)" class="text-red-600 hover:underline">
                        Delete
                    </button>
                    </li>
                </ul>
            </div>
        </main>

        <Footer />
    </div>
</template>

<script>
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';

export default {
  name: 'AdminDashboard',
  components: { Header, Footer },
  data() {
    return {
      tabs: ['Users','Spots','Bookings','Amenities'],
      currentTab: 'Users',
      users: [], spots: [], bookings: [], specs: [],
      newSpec: ''
    }
  },
  methods: {
    formatDate(d){ return d.split('T')[0]; },
    async fetchAll() {
      const token = localStorage.getItem('token');
      const headers = { Authorization:`Bearer ${token}` };
      [ this.users, this.spots, this.bookings, this.specs ] =
        await Promise.all([
          fetch('http://localhost:3000/users',{headers}).then(r=>r.json()),
          fetch('http://localhost:3000/spots',{headers}).then(r=>r.json()),
          fetch('http://localhost:3000/bookings',{headers}).then(r=>r.json()),
          fetch('http://localhost:3000/specifications',{headers}).then(r=>r.json())
        ]);
    },
    async addSpec() {
      if (!this.newSpec.trim()) return;
      const token = localStorage.getItem('token');
      await fetch('http://localhost:3000/specifications',{
        method:'POST',
        headers:{
          'Content-Type':'application/json',
          Authorization:`Bearer ${token}`
        },
        body: JSON.stringify({ specificationName:this.newSpec })
      });
      this.newSpec='';
      await this.fetchAll();
    },
    async delSpec(id) {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:3000/specifications/${id}`,{
        method:'DELETE',
        headers:{ Authorization:`Bearer ${token}` }
      });
      await this.fetchAll();
    }
  },
  mounted() {
    this.fetchAll();
  }
}
</script>
