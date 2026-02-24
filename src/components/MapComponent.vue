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
import Alerts from 'src/alerts';
import wait from 'src/helpers/wait';
import socket from 'src/API/Socket';
//Set up a flag to check for socket connection before initializing the map and fetching data
let noConnection = true;
//Update the flag when the socket connects
socket.on('connect', () => {
  noConnection = false;
});
socket.on('pong', () => {
  noConnection = false;
});
//On component mount
onMounted(async () => {
  Alerts.showLoading('txt.preLoader');
  console.log('Waiting for socket connection...');
  //Wait for the socket connection before initializing the map and fetching data
  while (noConnection) {
    await wait(1000);
    socket.emit('ping');
  }
  console.log('Socket connected, initializing map and fetching data...');
  Alerts.showLoading('txt.initializing');
  await init();
  const maps = useMapsList();
  await maps.refresh();
  const Map = getMap();
  Map.init();
  Map.initRouteHistoryHover();

  Routes.refresh().catch((e) => {
    console.error(e.message);
  });
  Alerts.hideLoading();
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
  background: radial-gradient(circle at center, rgba(20, 20, 60, 0.8) 0%, #000 70%);
}
</style>
