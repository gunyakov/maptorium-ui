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
            @click="API.MapChange('arcgiselevation', undefined, 20)"
            :background="API.baseMapButton == 20"
            >Elevation</MenuItem
          >
          <MenuItem
            @click="API.MapChange('arcgissat', undefined, 19)"
            :background="API.baseMapButton == 19"
            >Satellite</MenuItem
          >
          <MenuItem
            @click="API.MapChange('arcgisvector', 'arcgis', 18)"
            :background="API.baseMapButton == 18"
            >Vector (ArcGis Style)</MenuItem
          >
        </template>
      </MenuItemSub>
      <!--GOOGLE MAPS-->
      <MenuItemSub icon="mdi mdi-google-maps" id="googleMap">
        Google
        <template #items>
          <MenuItem
            @click="API.MapChange('googlesat', undefined, 17)"
            :background="API.baseMapButton == 17"
            >Satellite</MenuItem
          >
        </template>
      </MenuItemSub>
      <MenuItem
        @click="API.MapChange('osm', '', 16)"
        icon="far fa-map"
        :background="API.baseMapButton == 16"
        >OSM</MenuItem
      >
      <!--Yandex MAPS-->
      <MenuItemSub icon="mdi mdi-home-map-marker" id="yandexMap">
        Yandex
        <template #items>
          <MenuItem
            @click="API.MapChange('yandexsat', undefined, 15)"
            :background="API.baseMapButton == 15"
            >Satellite</MenuItem
          >
        </template>
      </MenuItemSub>
      <!--MapBOX MAPS-->
      <MenuItemSub icon="mdi mdi-home-map-marker" id="mapboxMap">
        MapBOX
        <template #items>
          <MenuItem @click="API.MapChange('mapbox', 'osm', 8)" :background="API.baseMapButton == 8"
            >Vector (OSM style)</MenuItem
          >
          <MenuItem
            @click="API.MapChange('mapbox', 'bright', 9)"
            :background="API.baseMapButton == 9"
            >Vector (Bright style)</MenuItem
          >
          <MenuItem
            @click="API.MapChange('mapbox', 'toner', 10)"
            :background="API.baseMapButton == 10"
            >Vector (Toner style)</MenuItem
          >
          <MenuItem
            @click="API.MapChange('mapbox', 'dataviz', 11)"
            :background="API.baseMapButton == 11"
            >Vector (DataViz Style)</MenuItem
          >
          <MenuItem
            @click="API.MapChange('mapbox', 'dark', 24)"
            :background="API.baseMapButton == 24"
            >Vector (DataViz Dark Style)</MenuItem
          >
          <MenuItem
            @click="API.MapChange('mapbox', 'light', 12)"
            :background="API.baseMapButton == 12"
            >Vector (Light Style)</MenuItem
          >
          <MenuItem
            @click="API.MapChange('mapbox', 'streets', 13)"
            :background="API.baseMapButton == 13"
            >Vector (Streets Style)</MenuItem
          >
          <MenuItem
            @click="API.MapChange('mapbox', 'winter', 14)"
            :background="API.baseMapButton == 14"
            >Vector (Winter Style)</MenuItem
          >
          <MenuItem
            @click="API.MapChange('mapbox', 'liberty', 22)"
            :background="API.baseMapButton == 22"
            >Vector (Liberty Style)</MenuItem
          >
        </template>
      </MenuItemSub>
      <!--Maptorium MAPS-->
      <MenuItemSub icon="mdi mdi-home-map-marker" id="maptoriumMap">
        Maptorium
        <template #items>
          <MenuItem
            @click="API.MapChange('maptorium', 'maptorium', 25)"
            :background="API.baseMapButton == 25"
            >Vector (Maptorium Style)</MenuItem
          >
          <MenuItem
            @click="API.MapChange('maptorium', 'osm', 1)"
            :background="API.baseMapButton == 1"
            >Vector (OSM Style)</MenuItem
          >
          <MenuItem
            @click="API.MapChange('maptorium', 'bright', 2)"
            :background="API.baseMapButton == 2"
            >Vector (Bright Style)</MenuItem
          >
          <MenuItem
            @click="API.MapChange('maptorium', 'toner', 3)"
            :background="API.baseMapButton == 3"
            >Vector (Toner Style)</MenuItem
          >
          <MenuItem
            @click="API.MapChange('maptorium', 'dataviz', 4)"
            :background="API.baseMapButton == 4"
            >Vector (DataViz Style)</MenuItem
          >
          <MenuItem
            @click="API.MapChange('maptorium', 'dark', 23)"
            :background="API.baseMapButton == 23"
            >Vector (DataViz Dark Style)</MenuItem
          >
          <MenuItem
            @click="API.MapChange('maptorium', 'light', 5)"
            :background="API.baseMapButton == 5"
            >Vector (Light Style)</MenuItem
          >
          <MenuItem
            @click="API.MapChange('maptorium', 'streets', 6)"
            :background="API.baseMapButton == 6"
            >Vector (Streets Style)</MenuItem
          >
          <MenuItem
            @click="API.MapChange('maptorium', 'winter', 7)"
            :background="API.baseMapButton == 7"
            >Vector (Winter Style)</MenuItem
          >
          <MenuItem
            @click="API.MapChange('maptorium', 'liberty', 21)"
            :background="API.baseMapButton == 21"
            >Vector (Liberty Style)</MenuItem
          >
        </template>
      </MenuItemSub>
    </template>
  </MenuBox>
</template>
