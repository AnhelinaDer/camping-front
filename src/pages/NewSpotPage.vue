<template>
  <div class="min-h-screen bg-gray-100 flex flex-col">
    <Header />

    <main class="max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:px-8 flex-grow">
      <div class="bg-white rounded-lg shadow p-6">
        <h1 class="text-2xl font-semibold mb-6">Add New Camping Spot</h1>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">Spot Name</label>
            <input
              type="text"
              id="name"
              v-model="form.name"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            >
          </div>

          <div>
            <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              v-model="form.description"
              rows="4"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            ></textarea>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="price" class="block text-sm font-medium text-gray-700">Price per Night</label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <input
                  type="number"
                  id="price"
                  v-model="form.pricePerNight"
                  required
                  min="0"
                  step="0.01"
                  class="pl-7 block w-full rounded-md border-gray-300 focus:border-green-500 focus:ring-green-500"
                >
              </div>
            </div>

            <div>
              <label for="currency" class="block text-sm font-medium text-gray-700">Currency</label>
              <input
                type="text"
                id="currency"
                v-model="form.currency"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              >
            </div>

            <div>
              <label for="streetAddress" class="block text-sm font-medium text-gray-700">Street Address</label>
              <input
                type="text"
                id="streetAddress"
                v-model="form.streetAddress"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              >
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="country" class="block text-sm font-medium text-gray-700">Country</label>
              <select
                id="country"
                v-model="form.countryId"
                required
                @change="loadCities"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              >
                <option value="">Select a country</option>
                <option v-for="country in countries" :key="country.countryId" :value="country.countryId">
                  {{ country.name }}
                </option>
              </select>
            </div>

            <div>
              <label for="city" class="block text-sm font-medium text-gray-700">City</label>
              <select
                id="city"
                v-model="form.cityId"
                required
                :disabled="!form.countryId"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              >
                <option value="">Select a city</option>
                <option v-for="city in cities" :key="city.cityId" :value="city.cityId">
                  {{ city.name }}
                </option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="latitude" class="block text-sm font-medium text-gray-700">Latitude</label>
              <input
                type="number"
                id="latitude"
                v-model="form.latitude"
                required
                step="any"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              >
            </div>

            <div>
              <label for="longitude" class="block text-sm font-medium text-gray-700">Longitude</label>
              <input
                type="number"
                id="longitude"
                v-model="form.longitude"
                required
                step="any"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              >
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Specifications</label>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div v-for="spec in specifications" :key="spec.specificationId" class="flex items-center">
                <input
                  type="checkbox"
                  :id="'spec-' + spec.specificationId"
                  :value="spec.specificationId"
                  v-model="form.specifications"
                  class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                >
                <label :for="'spec-' + spec.specificationId" class="ml-2 block text-sm text-gray-700">
                  {{ spec.specificationName }}
                </label>
              </div>
            </div>
          </div>

          <!-- Availability Ranges -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Availability Ranges</label>
            
            <!-- New Range Input -->
            <div class="flex flex-wrap gap-2 items-end">
              <!-- Date Picker -->
              <DatePicker
                v-model="newRange"
                :ownerChosenDates="generateAvailabilityDates().map(d => d.date)"
              />

              <button
                type="button"
                :disabled="!canAddRange"
                @click="addRange"
                class="bg-green-600 text-white px-3 py-1 rounded disabled:opacity-50"
              >
                Add Range
              </button>
            </div>
            <p v-if="rangeError" class="text-red-500 text-xs mt-1">{{ rangeError }}</p>
            <p class="text-gray-500 text-xs mt-1">
              Select a start and end date to add a range. The end date must be at least one day after the start date. 
              The chosen date ranges will be disabled in the calendar view, to change this you need to remove the range 
              from the list and choose new dates.
            </p>

            <!-- List of Ranges -->
            <ul class="mt-4 space-y-1">
              <li
                v-for="(r, idx) in form.availabilityRanges"
                :key="idx"
                class="flex justify-between items-center bg-gray-50 px-3 py-2 rounded"
              >
                <span>{{ r.startDate }} → {{ r.endDate }}</span>
                <button
                  type="button"
                  @click="removeRange(idx)"
                  class="text-red-600 hover:underline text-sm"
                >
                  Remove
                </button>
              </li>
            </ul>
          </div>

          <div>
            <label for="images" class="block text-sm font-medium text-gray-700">Images</label>
            <input
              type="file"
              id="images"
              @change="handleImageUpload"
              multiple
              accept="image/*"
              class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
            >
          </div>

          <div v-if="selectedImages.length > 0" class="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div v-for="(image, index) in selectedImages" :key="index" class="relative">
              <img :src="image.preview" alt="Preview" class="w-full h-32 object-cover rounded">
              <button
                @click="removeImage(index)"
                type="button"
                class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                x
              </button>
            </div>
          </div>

          <div class="flex gap-4">
            <button
              type="submit"
              :disabled="loading"
              class="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {{ loading ? 'Creating...' : 'Create Spot' }}
            </button>
            <router-link
              to="/my-spots"
              class="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 text-center"
            >
              Cancel
            </router-link>
          </div>

          <div v-if="error" class="mt-4 text-red-600 text-center">
            {{ error }}
          </div>
        </form>
      </div>
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
      form: {
        name: '',
        description: '',
        pricePerNight: '',
        streetAddress: '',
        latitude: '',
        longitude: '',
        countryId: '',
        cityId: '',
        specifications: [],
        availabilityRanges: [],
        currency: 'EUR'
      },
      countries: [],
      cities: [],
      specifications: [],
      selectedImages: [],
      loading: false,
      error: null,
      newRange: { start: '', end: '' },
      rangeError: null,
    };
  },
  computed: {
    today() {
      return new Date().toISOString().split('T')[0];
    },
    // can only add if both dates set and end > start
    canAddRange() {
      const r = this.newRange || {};
      const startDate = r.start, endDate = r.end;
      if (!startDate || !endDate) return false;
      return new Date(endDate) > new Date(startDate);
    }
  },
  methods: {
    async loadCountries() {
      try {
        const response = await fetch('http://localhost:3000/countries');
        if (!response.ok) throw new Error('Failed to load countries');
        this.countries = await response.json();
      } catch (err) {
        this.error = 'Failed to load countries';
      }
    },
    async loadCities() {
      if (!this.form.countryId) {
        this.cities = [];
        return;
      }
      try {
        const response = await fetch(`http://localhost:3000/cities/${this.form.countryId}`);
        if (!response.ok) throw new Error('Failed to load cities');
        this.cities = await response.json();
      } catch (err) {
        this.error = 'Failed to load cities';
      }
    },
    async loadSpecifications() {
      try {
        const response = await fetch('http://localhost:3000/specifications');
        if (!response.ok) throw new Error('Failed to load specifications');
        this.specifications = await response.json();
      } catch (err) {
        this.error = 'Failed to load specifications';
      }
    },
    addRange() {
      this.rangeError = null;
      if (!this.canAddRange) {
        this.rangeError = 'End must be at least one day after start.';
        return;
      }

      // push and reset inputs
      this.form.availabilityRanges.push({
        startDate: this.newRange.start.toISOString().split('T')[0],
        endDate:   this.newRange.end.toISOString().split('T')[0]
      });
      this.newRange = { start: null, end: null };
    },
    removeRange(index) {
      this.form.availabilityRanges.splice(index, 1);
    },

    // flatten your ranges into the API payload
    generateAvailabilityDates() {
      const dates = [];
      this.form.availabilityRanges.forEach(({ startDate, endDate }) => {
        let cur = new Date(startDate);
        const end = new Date(endDate);
        cur.setHours(0,0,0,0);
        while (cur <= end) {
          dates.push({
            date: cur.toISOString(),
            isBooked: false
          });
          cur.setDate(cur.getDate() + 1);
        }
      });

      // Ensure at least one date is present if no ranges are added so the date picker works correctly
      if (dates.length === 0) {
        dates.push({
          date: new Date(2015, 1, 1).toISOString(),
          isBooked: false
        });
      }
      return dates;
    },
    handleImageUpload(event) {
      const files = Array.from(event.target.files);
      
      files.forEach(file => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader(); // FileReader is a browser API that can convert a File into 
          // a Base64-encoded string (data: URL), which can be used directly as an <img src="…">
          reader.onload = (e) => {
            this.selectedImages.push({
              file: file,
              preview: e.target.result
            });
          };
          reader.readAsDataURL(file);
        }
      });
    },
    removeImage(index) {
      this.selectedImages.splice(index, 1);
    },
    async handleSubmit() {
      this.loading = true;
      this.error = null;

      if (this.form.availabilityRanges.length === 0) {
        this.error = 'Please add at least one availability range.';
        this.loading = false;
        return;
      }

      try {
        const token = localStorage.getItem('token');
        
        // Create FormData for the request
        const formData = new FormData();
        
        // Add basic spot information
        formData.append('name', this.form.name);
        formData.append('description', this.form.description);
        formData.append('streetAddress', this.form.streetAddress);
        formData.append('latitude', this.form.latitude);
        formData.append('longitude', this.form.longitude);
        formData.append('pricePerNight', this.form.pricePerNight);
        formData.append('currency', this.form.currency);
        formData.append('countryId', this.form.countryId);
        formData.append('cityId', this.form.cityId);
        
        // Add arrays as JSON strings
        formData.append('specifications', JSON.stringify(this.form.specifications));
        formData.append('availability', JSON.stringify(this.generateAvailabilityDates()));

        // Add images to FormData
        this.selectedImages.forEach(image => {
          formData.append('images', image.file);
        });

        // Send the request
        const spotResponse = await fetch('http://localhost:3000/spots', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        if (!spotResponse.ok) {
          const errorData = await spotResponse.json();
          throw new Error(errorData.message || 'Failed to create spot');
        }

        // Redirect to the my spots page
        this.$router.push('/my-spots');
      } catch (err) {
        this.error = err.message || 'Something went wrong';
        console.error('Error creating spot:', err);
      } finally {
        this.loading = false;
      }
    }
  },
  async mounted() {
    await Promise.all([
      this.loadCountries(),
      this.loadSpecifications()
    ]);
  }
};
</script> 
