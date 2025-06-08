<template>
  <div class="min-h-screen bg-gray-100 flex flex-col">
    <Header />

    <main class="max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:px-8 flex-grow">
      <div v-if="loading" class="text-center text-gray-600">
        Loading spot details...
      </div>

      <div v-else-if="error" class="text-center text-red-600">
        {{ error }}
      </div>

      <div v-else class="bg-white rounded-lg shadow p-6">
        <h1 class="text-2xl font-semibold mb-6">Edit Camping Spot</h1>

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
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span class="text-gray-500 sm:text-sm">€</span>
                </div>
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

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Availability</label>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="startDate" class="block text-sm text-gray-600">Start Date</label>
                <input
                  type="date"
                  id="startDate"
                  v-model="form.startDate"
                  required
                  :min="today"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                >
              </div>
              <div>
                <label for="endDate" class="block text-sm text-gray-600">End Date</label>
                <input
                  type="date"
                  id="endDate"
                  v-model="form.endDate"
                  required
                  :min="form.startDate || today"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                >
              </div>
            </div>
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

          <div v-if="existingImages.length > 0" class="mt-4">
            <h3 class="text-sm font-medium text-gray-700 mb-2">Current Images</h3>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div v-for="(image, index) in existingImages" :key="index" class="relative">
                <img 
                  :src="`http://localhost:3000/spotImages/${image.imageURL}`" 
                  :alt="'Existing image ' + (index + 1)"
                  class="w-full h-32 object-cover rounded"
                >
                <button
                  @click="removeExistingImage(index)"
                  type="button"
                  class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  x
                </button>
              </div>
            </div>
          </div>

          <div v-if="selectedImages.length > 0" class="mt-4">
            <h3 class="text-sm font-medium text-gray-700 mb-2">New Images to Upload</h3>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
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
          </div>

          <div class="flex gap-4">
            <button
              type="submit"
              :disabled="loading"
              class="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {{ loading ? 'Saving...' : 'Save Changes' }}
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

export default {
  components: { Header, Footer },
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
        startDate: '',
        endDate: '',
        currency: 'EUR'
      },
      countries: [],
      cities: [],
      specifications: [],
      selectedImages: [],
      existingImages: [],
      loading: true,
      error: null
    };
  },
  computed: {
    today() {
      return new Date().toISOString().split('T')[0];
    },
    spotId() {
      return this.$route.params.id;
    }
  },
  methods: {
    async loadSpotDetails() {
      try {
        const response = await fetch(`http://localhost:3000/spots/${this.spotId}`);
        if (!response.ok) throw new Error('Failed to load spot details');
        
        const spot = await response.json();
        
        // Check if user is the owner
        const token = localStorage.getItem('token');
        const userId = JSON.parse(atob(token.split('.')[1])).userId;
        if (spot.ownerId !== userId) {
          this.$router.push('/my-spots');
          throw new Error('You are not authorized to edit this spot');
        }

        // Populate form with spot details
        this.form.name = spot.name;
        this.form.description = spot.description;
        this.form.streetAddress = spot.streetAddress;
        this.form.latitude = spot.latitude;
        this.form.longitude = spot.longitude;
        this.form.countryId = spot.cities.countries.countryId;
        this.form.cityId = spot.cities.cityId;
        this.form.pricePerNight = spot.prices[0]?.price || '';
        this.form.currency = spot.prices[0]?.currency || 'EUR';
        this.form.specifications = spot.spotspecifications.map(spec => spec.specifications.specificationId);
        
        // Load existing images
        this.existingImages = spot.images || [];

        // Load cities for the selected country
        await this.loadCities();

      } catch (err) {
        this.error = err.message;
        console.error('Error loading spot:', err);
      }
    },
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
    handleImageUpload(event) {
      const files = Array.from(event.target.files);
      
      files.forEach(file => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
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
    removeExistingImage(index) {
      this.existingImages.splice(index, 1);
    },
    generateAvailabilityDates() {
      const dates = [];
      const start = new Date(this.form.startDate);
      const end = new Date(this.form.endDate);
      
      // Set time to midnight to avoid timezone issues
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      
      // Create a new date object to avoid modifying the original start date
      let currentDate = new Date(start);
      
      while (currentDate <= end) {
        dates.push({
          date: currentDate.toISOString(),
          isBooked: false
        });
        // Move to next day
        currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
      }
      
      return dates;
    },
    async handleSubmit() {
      this.loading = true;
      this.error = null;

      try {
        const token = localStorage.getItem('token');
        
        // Create FormData for the request
        const formData = new FormData();
        
        // Add basic spot information
        formData.append('name', this.form.name);
        formData.append('description', this.form.description);
        formData.append('streetAddress', this.form.streetAddress);
        formData.append('latitude', this.form.latitude.toString());
        formData.append('longitude', this.form.longitude.toString());
        formData.append('pricePerNight', this.form.pricePerNight);
        formData.append('currency', this.form.currency);
        formData.append('countryId', this.form.countryId);
        formData.append('cityId', this.form.cityId);
        
        // Add arrays as JSON strings
        formData.append('specifications', JSON.stringify(this.form.specifications));
        formData.append('availability', JSON.stringify(this.generateAvailabilityDates()));

        // Append the filenames of images the user didn't remove:
        formData.append('existingImages', JSON.stringify(this.existingImages.map(img => img.imageURL)));

        // Append all new File objects:
        this.selectedImages.forEach(f => formData.append('images', f.file));

        // Send the request
        const spotResponse = await fetch(`http://localhost:3000/spots/${this.spotId}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        if (!spotResponse.ok) {
          const errorData = await spotResponse.json();
          throw new Error(errorData.message || 'Failed to update spot');
        }

        // Redirect to the my spots page
        this.$router.push('/my-spots');
      } catch (err) {
        this.error = err.message || 'Something went wrong';
        console.error('Error updating spot:', err);
      } finally {
        this.loading = false;
      }
    }
  },
  async mounted() {
    try {
      await Promise.all([
        this.loadCountries(),
        this.loadSpecifications(),
        this.loadSpotDetails()
      ]);
    } finally {
      this.loading = false;
    }
  }
};
</script> 
