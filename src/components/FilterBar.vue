<template>
  <div class="mt-4 flex flex-wrap gap-2 justify-center text-sm">
    <button
      v-for="spec in specifications"
      :key="spec.specificationId"
      @click="$emit('toggle-filter', spec.specificationId)"
      :class="[
        'px-3 py-1 rounded-full border transition',
        selected.includes(spec.specificationId)
          ? 'bg-green-600 text-white'
          : 'bg-white text-green-700 hover:bg-green-100'
      ]"
    >
      {{ spec.specificationName }}
    </button>
  </div>
</template>

<script>
export default {
  props: {
    selected: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      specifications: []
    };
  },
  mounted() {
    fetch('http://localhost:3000/specifications')
      .then(res => res.json())
      .then(data => (this.specifications = data));
  }
};
</script>

