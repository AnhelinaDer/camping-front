<template>
  <!-- Vue2-Leaflet map wrapper -->
  <!-- Zoom level (e.g. 13 for city-level) -->
  <l-map 
    :zoom="zoom"                        
    :center="[lat, lng]"                
    style="height: 300px;               
           width: 100%;                
           border-radius: 8px;"        
  >
    
    <!-- Tile layer: pulls map tiles from OpenStreetMap -->
    <!-- OSM tile server URL template -->
    <!-- Required attribution text -->
    <l-tile-layer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
      attribution="© OpenStreetMap contributors"               
    />
      
    <!-- Single map marker at the spot’s location -->
    <l-marker :lat-lng="[lat, lng]">
      <!-- Popup displayed when the marker is clicked -->
      <l-popup>
        {{ popupText }}  <!-- e.g. the spot’s street address or name -->
      </l-popup>
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
