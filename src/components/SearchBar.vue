<template>
    <input
      type="text"
      v-model="search"
      placeholder="Search by name or description"
      @input="$emit('search', search)"
    />
  </template>
  
  <script>
  export default {
    props: ['value'],
    data() {
      return { search: this.value };
    },
    watch: {
      value(val) {
        this.search = val;
      }
    }
  };
  </script>
  