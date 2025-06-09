<template>
  <l-map 
    :zoom="zoom" 
    :center="[lat, lng]" 
    style="height: 300px; width: 100%; border-radius: 8px;"
  >
    <l-tile-layer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution="© OpenStreetMap contributors"
    />
    <l-marker :lat-lng="[lat, lng]">
      <l-popup>{{ popupText }}</l-popup>
    </l-marker>
  </l-map>
</template>

<script>
export default {
  name: 'SpotMap',
  props: {
    lat:  { type: Number, required: true },
    lng:  { type: Number, required: true },
    popupText: { type: String, default: '' },
    zoom: { type: Number, default: 13 }
  }
}
</script>

<style scoped>
/* nothing else needed—Leaflet CSS is loaded globally */
</style>
