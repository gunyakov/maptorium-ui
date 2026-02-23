<template>
  <div class="map-wrapper">
    <div id="map" class="map-container"></div>
    <DrawMeasureOverlay />
    <RouteHoverMeasureOverlay />
    <GPSinfo />
    <CachedMapBar />
    <InfoBar />
  </div>
</template>
<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue';
import { getMap } from 'src/map/Map';
import { useMapsList } from 'src/composables/useMapsList';
import InfoBar from 'src/components/InfoBar.vue';
import GPSinfo from 'src/components/GPSinfo.vue';
import CachedMapBar from 'src/components/CachedMapBar.vue';
import DrawMeasureOverlay from 'src/components/DrawMeasureOverlay.vue';
import RouteHoverMeasureOverlay from 'src/components/RouteHoverMeasureOverlay.vue';
import Routes from 'src/API/Routes';
import init from 'src/API/init';

const maps = useMapsList();
onMounted(async () => {
  await init();
  await maps.refresh();
  const Map = getMap();
  Map.init();
  Map.initRouteHistoryHover();

  Routes.refresh().catch((e) => {
    console.error(e.message);
  });
});

onBeforeUnmount(() => {
  const Map = getMap();
  Map.destroyRouteHistoryHover();
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
