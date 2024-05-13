<script setup lang="ts">
import { onMounted } from 'vue'

import Map from '@/map/index'
import InfoBar from './InfoBar.vue'
import InfoGPS from './InfoGPS.vue'
import MenuContext from '@/components/menu/MenuContext.vue'
import JobManager from '@/components/JobManager.vue'
import DistanceContainer from '@/components/DistanceContainer.vue'
import POIManager from '@/components/POIManager.vue'
import CachedMapBar from '@/components/CachedMapBar.vue'
onMounted(function () {
  Map.init()
})
</script>
<template>
  <div class="main-content">
    <div id="map"></div>
    <pre id="info"></pre>
    <InfoGPS />
    <InfoBar />
    <MenuContext />
    <JobManager />
    <DistanceContainer />
    <POIManager />
    <CachedMapBar />
  </div>
</template>
<style>
#info {
  display: none;
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translate(-50%);
  width: 50%;
  padding: 10px;
  border: none;
  border-radius: 3px;
  font-size: 12px;
  text-align: center;
  background-color: rgba(7, 23, 57, 0.7);
  color: #c8d4f0;
  backdrop-filter: blur(3px);
  opacity: 0.7;
}

.dark-theme #info {
  background-color: rgba(24, 25, 26, 0.7);
  color: #a9b4cc;
}

.light-theme #info {
  background-color: rgba(245, 245, 245, 0.7);
  color: #464646;
}
</style>
