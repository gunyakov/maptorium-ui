<script setup lang="ts">
import Lang from '@/lang/index'
import API from '@/API/index'

import MenuBox from '@/components/menu/MenuItems/MenuBox.vue'
import MenuItem from '@/components/menu/MenuItems/MenuItem.vue'
import MenuItemSub from '@/components/menu/MenuItems/MenuItemSub.vue'
//----------------------------------------------------------------------------------------------------------------------
//MAPTORIUM modals handler
//----------------------------------------------------------------------------------------------------------------------
import inputModalNew, { ModalsList } from '@/API/Modals'
import type { GPSCoords, POIInfo } from '@/interface'
import { POIType } from '@/enum'
async function toggleShow() {
  if (API.Routes.show.value) {
    if (await API.DefConfigSet({ showRoute: false })) API.Routes.Hide()
  } else {
    if (await API.DefConfigSet({ showRoute: true })) {
      API.Routes.show.value = true
      API.Routes.Points()
    }
  }
}
/** Read data from route file and display on map */
async function routeFromFileModal() {
  const data = (await inputModalNew(ModalsList.GPSRouteFromFile)) as string | false
  if (data) {
    // Split the string by line endings
    let lines = data.split(/\r?\n/) // This handles both \n and \r\n

    // Read and process each line
    lines = lines.filter((line) => !line.trim().startsWith('//'))
    const arrCoords: GPSCoords[] = []
    for (let i = 0; i < lines.length; i++) {
      const coord = lines[i].split(',')
      //Convert DMS to Decimal Degrees
      //003,01,15.418,N,103,56.962,E,0.10,0.10,0.50,006.0,RL,11.46,0.50,08:00,W,EASTERN PEBGB
      let lat = parseInt(coord[1]) + parseFloat(coord[2]) / 60

      // Adjust for hemisphere
      if (coord[3] == 'S') lat = -lat

      let name = coord[16]
      let lng = parseInt(coord[4]) + parseFloat(coord[5]) / 60
      if (coord[6] == 'W') lng = -lng
      if (lat && lng) {
        arrCoords.push({ lat, lng })
      }
    }
    const poiInfo: POIInfo = {
      type: POIType.polyline,
      points: arrCoords,
      categoryID: 0,
      ID: 0,
      name: 'GPS Planned Route',
      color: '#666666',
      width: 2,
      fillColor: '0',
      fillOpacity: 0,
      visible: 1
    }
    API.POI.Add(poiInfo)
  }
}
</script>
<template>
  <MenuBox>
    {{ Lang.TXT_GPS }}
    <template #items>
      <!--GPS SERVICE-->
      <MenuItemSub icon="mdi mdi-satellite-variant" id="gpsService">
        {{ Lang.BTN_GPS_SERVICE }}
        <template #items>
          <MenuItem :background="API.GPS.run.value" @click="API.GPS.toggle()">{{
            Lang.BTN_GPS_SERVICE_START
          }}</MenuItem>
          <MenuItem @click="API.GPS.GPSConfigModal()">{{ Lang.BTN_GPS_SERVICE_OPTIONS }}</MenuItem>
        </template>
      </MenuItemSub>
      <!--GPS ROUTE-->
      <MenuItemSub icon="mdi mdi-go-kart-track" id="gpsRoute">
        {{ Lang.BTN_GPS_ROUTE }}
        <template #items>
          <MenuItem :background="API.GPS.record.value" @click="API.GPS.toggleRecord()">{{
            Lang.BTN_GPS_ROUTE_RECORD
          }}</MenuItem>
          <MenuItem :background="API.Routes.show.value" @click="toggleShow()">{{
            Lang.BTN_GPS_ROUTE_SHOW
          }}</MenuItem>
          <MenuItem @click="API.Routes.New()">{{ Lang.BTN_GPS_ROUTE_NEW }}</MenuItem>
          <MenuItem @click="API.GPS.SampleTime()">{{ Lang.BTN_GPS_SAMPLE_TIME }}</MenuItem>
          <MenuItem @click="API.GPS.distanceToGoModal()">
            {{ Lang.BTN_GSP_DISTANCE_GO }}...
          </MenuItem>
          <MenuItem @click="routeFromFileModal"> {{ Lang.BTN_GPS_ROUTE_FROM_FILE }}... </MenuItem>
        </template>
      </MenuItemSub>
      <!--GPS HISTORY-->
      <MenuItemSub icon="mdi mdi-history" id="gpsHistory">
        {{ Lang.BTN_GPS_HISTORY }}
        <template #items>
          <MenuItem>
            {{ Lang.BTN_GPS_HISTORY_CLEAN }}
          </MenuItem>
          <MenuItem
            v-for="(item, index) in API.Routes.routes.value"
            :key="'route' + index"
            @click="API.Routes.Points(item.ID)"
          >
            {{ item.name }}
          </MenuItem>
        </template>
      </MenuItemSub>
      <!--GPS FOLLOW-->
      <MenuItem icon="mdi mdi-satellite-uplink" :background="false" @click="() => {}">
        {{ Lang.BTN_GPS_FOLLOW }}
      </MenuItem>
      <!--GPS CENTER-->
      <MenuItem
        icon="mdi mdi-axis-arrow-lock"
        :background="API.GPS.center.value"
        @click="API.GPS.center.value = !API.GPS.center.value"
      >
        {{ Lang.BTN_GPS_CENTER }}
      </MenuItem>
      <!--GPS MARK-->
      <MenuItem
        icon="mdi mdi-pin"
        :background="false"
        @click="API.POI.poiCoords = { ...API.GPS.lastCoords }"
        data-bs-toggle="modal"
        data-bs-target="#POIAddModal"
      >
        {{ Lang.BTN_GPS_ADD_MARK }}
      </MenuItem>
    </template>
  </MenuBox>
</template>
