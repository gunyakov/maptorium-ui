<template>
  <div class="map-wrapper">
    <div id="map" class="map-container"></div>
    <DrawMeasureOverlay />
  </div>
</template>
<script setup lang="ts">
import { onMounted } from 'vue';
import { getMap } from 'src/map/Map';
import { useMapsList } from 'src/composables/useMapsList';
import DrawMeasureOverlay from 'src/components/DrawMeasureOverlay.vue';
import Routes from 'src/API/Routes';
const maps = useMapsList();
onMounted(async () => {
  await maps.refresh();
  const Map = getMap();
  Map.init();
  Routes.refresh().catch((e) => {
    console.error(e.message);
  });
});
</script>
<style lang="css" scoped>
.map-wrapper {
  position: relative;
  height: 100%;
}

.map-container {
  height: 100%;
  /* These two lines are still needed for iOS Safari */
  overflow-y: hidden !important;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
</style>
