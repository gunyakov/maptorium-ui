<script setup lang="ts">
import Lang from '@/lang/index'
import API from '@/API/index'
</script>
<template>
  <table class="gps-info" :style="{ display: API.GPS.show.value ? 'block' : 'none' }">
    <tr>
      <td style="width: 90px">{{ Lang.TXT_DISTANCE_RUN }}:</td>
      <td class="overflow-hidden">
        {{ API.GPS.distanceRun }} {{ Lang[`TXT_UNIT_DISTANCE_${API.GPS.untisKey.toUpperCase()}`] }}
      </td>
    </tr>
    <tr>
      <td>{{ Lang.BTN_GSP_DISTANCE_GO }}:</td>
      <td class="overflow-hidden">
        {{ Math.floor(API.GPS.leaveDistance.value * 100) / 100 }}
        {{ Lang[`TXT_UNIT_DISTANCE_${API.GPS.untisKey.toUpperCase()}`] }}
      </td>
    </tr>
    <tr>
      <td>{{ Lang.TXT_TIME_GO }}:</td>
      <td class="overflow-hidden">{{ API.GPS.time }}</td>
    </tr>
    <tr>
      <td>{{ Lang.TXT_SPEED }}:</td>
      <td class="overflow-hidden">
        {{ API.GPS.speed }} {{ Lang[`TXT_UNITS_SPEED_${API.GPS.untisKey.toUpperCase()}`] }}
      </td>
    </tr>
    <tr>
      <td>{{ Lang.TXT_COURSE }}:</td>
      <td class="overflow-hidden">{{ API.GPS.dir }}º</td>
    </tr>
  </table>
</template>
<style>
.gps-info {
  position: absolute;
  left: 18px;
  bottom: 36px;
  width: 200px;
  backdrop-filter: blur(3px);
  border-style: solid;
  background-color: rgba(7, 23, 57, 0.7);
  color: #c8d4f0;
  border-color: #c8d4f0;
  border-width: 2px;
  border-radius: 5px;
  font-size: x-small;
  font-weight: var(--bs-body-font-weight);
  line-height: var(--bs-body-line-height);
}

.dark-theme .gps-info {
  background-color: rgba(24, 25, 26, 0.7);
  color: #a9b4cc;
  border-color: #a9b4cc;
}

.light-theme .gps-info {
  background-color: rgba(245, 245, 245, 0.7);
  color: #464646;
  border-color: #464646;
}
</style>
