<script setup lang="ts">
import Lang from '@/lang/index'
import API from '@/API/index'
import MenuBox from '@/components/menu/MenuItems/MenuBox.vue'
import MenuItem from '@/components/menu/MenuItems/MenuItem.vue'
import MenuItemSub from '@/components/menu/MenuItems/MenuItemSub.vue'
</script>
<template>
  <MenuBox>
    {{ Lang.TXT_BASEMAP }}
    <template #items>
      <!--ArcGIS MAPS-->
      <MenuItemSub icon="mdi mdi-home-map-marker" id="arcgisMap">
        ArcGIS
        <template #items>
          <MenuItem
            @click="API.MapChange('arcgiselevation')"
            :background="API.baseMap.value == 'arcgiselevation'"
            >Elevation</MenuItem
          >
          <MenuItem
            @click="API.MapChange('arcgissat')"
            :background="API.baseMap.value == 'arcgissat'"
            >Satellite</MenuItem
          >
          <MenuItem
            @click="API.MapChange('arcgisvector', 'osm')"
            :background="API.baseMap.value == 'arcgisvector'"
            >Vector (OSM Style)</MenuItem
          >
        </template>
      </MenuItemSub>
      <!--GOOGLE MAPS-->
      <MenuItemSub icon="mdi mdi-google-maps" id="googleMap">
        Google
        <template #items>
          <MenuItem
            @click="API.MapChange('googlesat')"
            :background="API.baseMap.value == 'googlesat'"
            >Satellite</MenuItem
          >
        </template>
      </MenuItemSub>
      <MenuItem
        @click="API.MapChange('osm')"
        icon="far fa-map"
        :background="API.baseMap.value == 'osm'"
        >OSM</MenuItem
      >
      <!--Yandex MAPS-->
      <MenuItemSub icon="mdi mdi-home-map-marker" id="yandexMap">
        Yandex
        <template #items>
          <MenuItem
            @click="API.MapChange('yandexsat')"
            :background="API.baseMap.value == 'yandexsat'"
            >Satellite</MenuItem
          >
        </template>
      </MenuItemSub>
      <!--MapBOX MAPS-->
      <MenuItemSub icon="mdi mdi-home-map-marker" id="mapboxMap">
        MapBOX
        <template #items>
          <MenuItem
            @click="API.MapChange('mapbox', 'osm')"
            :background="API.baseMap.value == 'mapbox'"
            >Vector (OSM style)</MenuItem
          >
          <MenuItem>Vector (Some style)</MenuItem>
        </template>
      </MenuItemSub>
      <!--Maptorium MAPS-->
      <MenuItemSub icon="mdi mdi-home-map-marker" id="maptoriumMap">
        Maptorium
        <template #items>
          <MenuItem
            @click="API.MapChange('maptorium', 'osm')"
            :background="API.baseMap.value == 'maptorium'"
            >Vector (OSM Style)</MenuItem
          >
          <MenuItem>Vector (Some style)</MenuItem>
        </template>
      </MenuItemSub>
    </template>
  </MenuBox>
</template>
