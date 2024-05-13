<script setup lang="ts">
import Lang from '@/lang/index'
import MenuBox from '@/components/menu/MenuItems/MenuBox.vue'
import MenuItem from '@/components/menu/MenuItems/MenuItem.vue'

import API from '@/API/index'

function toggleGPSPane() {
  ;(API.GPS.show.value = !API.GPS.show.value),
    API.DefConfigSet({ GPSInfoPanel: API.GPS.show.value }, false)
}
function toggleJobManager() {
  API.JobManager.show.value = !API.JobManager.show.value
  API.DefConfigSet({ jobManager: API.JobManager.show.value }, false)
}
function togglePOIManager() {
  API.POI.show.value = !API.POI.show.value
  API.DefConfigSet({ poiManager: API.POI.show.value }, false)
}
</script>
<template>
  <MenuBox>
    {{ Lang.BTN_PANES }}
    <template #items>
      <MenuItem
        icon="mdi mdi-crosshairs-question"
        :background="API.GPS.show.value"
        @click="toggleGPSPane"
      >
        {{ Lang.BTN_PANES_GPS }}
      </MenuItem>
      <MenuItem
        icon="mdi mdi-database-arrow-down"
        :background="API.JobManager.show.value"
        @click="toggleJobManager"
      >
        {{ Lang.BTN_JOB_MANAGER }}
      </MenuItem>
      <MenuItem
        icon="mdi mdi-database-arrow-down"
        :background="API.POI.show.value"
        @click="togglePOIManager"
      >
        {{ Lang.TXT_POI_LIST }}
      </MenuItem>
    </template>
  </MenuBox>
</template>
