<script setup lang="ts">
import Lang from '@/lang/index'
import API from '@/API/index'
import MenuBox from '@/components/menu/MenuItems/MenuBox.vue'
import MenuItem from '@/components/menu/MenuItems/MenuItem.vue'
import MenuItemSub from '@/components/menu/MenuItems/MenuItemSub.vue'
</script>
<template>
  <MenuBox>
    {{ Lang.TXT_LAYERMAP }}
    <template #items>
      <!--ArcGIS MAPS-->
      <MenuItemSub icon="mdi mdi-home-map-marker" id="arcgisLayer">
        ArcGIS
        <template #items>
          <MenuItem>Vector</MenuItem>
        </template>
      </MenuItemSub>
      <!--Google MAPS-->
      <MenuItemSub icon="mdi mdi-google-maps" id="googleLayer">
        Google
        <template #items>
          <MenuItem @click="API.LayerToggle('googlehybgb')">Hybrid (GB)</MenuItem>
          <MenuItem @click="API.LayerToggle('googlehyb')">Hybrid (RU)</MenuItem>
        </template>
      </MenuItemSub>
      <!--MapBOX MAPS-->
      <MenuItemSub icon="mdi mdi-google-maps" id="mapboxLayer">
        MapBOX
        <template #items>
          <MenuItem @click="API.LayerToggle('mapbox', 'bright')">Vector</MenuItem>
          <MenuItem>Hillshade</MenuItem>
          <MenuItem>Terraine</MenuItem>
        </template>
      </MenuItemSub>
      <!--Marine MAPS-->
      <MenuItemSub icon="mdi mdi-waves" id="marineLayer">
        Marine
        <template #items>
          <MenuItem @click="API.LayerToggle('osmmarine')">OSM Marine</MenuItem>
        </template>
      </MenuItemSub>
      <!--Yandex MAPS-->
      <MenuItemSub icon="mdi mdi-home-map-marker" id="yandexLayer">
        Yandex
        <template #items>
          <MenuItem @click="API.LayerToggle('yandexhyb')">Hybrid</MenuItem>
        </template>
      </MenuItemSub>
      <!--Maptorium MAPS-->
      <MenuItemSub icon="mdi mdi-home-map-marker" id="maptoriumLayer">
        Maptorium
        <template #items>
          <MenuItem @click="API.LayerToggle('maptorium', 'bright')">Vector (Bright)</MenuItem>
        </template>
      </MenuItemSub>
    </template>
  </MenuBox>
</template>
