<template>
  <div class="q-pa-sm q-pl-md row items-center">
    <FileMenu />
    <DrawMenu />
    <MapsMenu />
    <LayersMenu />
    <ViewMenu />
    <GPSMenu />
  </div>
</template>
<script setup lang="ts">
import FileMenu from './menu/FileMenu.vue';
import DrawMenu from './menu/DrawMenu.vue';
import MapsMenu from './menu/MapsMenu.vue';
import LayersMenu from './menu/LayersMenu.vue';
import ViewMenu from './menu/ViewMenu.vue';
import GPSMenu from './menu/GPSMenu.vue';
</script>
