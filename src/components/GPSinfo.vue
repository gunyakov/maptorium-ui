<script setup lang="ts">
import { computed } from 'vue';
import GPS from 'src/API/GPS';
import { useSettingsStore } from 'src/stores/settings';

const settings = useSettingsStore();

const show = computed(() => settings.gpsInfo);
const distanceToGo = computed(() => Math.floor(GPS.leaveDistance.value * 100) / 100);
const distanceUnitKey = computed(() => settings.units);
</script>

<template>
  <table v-if="show" class="gps-info">
    <tr>
      <td style="width: 90px">{{ $t('txt.gps.info.distance_run') }}:</td>
      <td class="overflow-hidden">
        {{ GPS.distanceRun.value }} {{ $t(`txt.gps.info.distance_units.${distanceUnitKey}`) }}
      </td>
    </tr>
    <tr>
      <td>{{ $t('txt.gps.info.distance_to_go') }}:</td>
      <td class="overflow-hidden">
        {{ distanceToGo }} {{ $t(`txt.gps.info.distance_units.${distanceUnitKey}`) }}
      </td>
    </tr>
    <tr>
      <td>{{ $t('txt.gps.info.time_to_go') }}:</td>
      <td class="overflow-hidden">{{ GPS.time.value }}</td>
    </tr>
    <tr>
      <td>{{ $t('txt.gps.info.speed') }}:</td>
      <td class="overflow-hidden">
        {{ GPS.speed.value }} {{ $t(`txt.gps.info.speed_units.${distanceUnitKey}`) }}
      </td>
    </tr>
    <tr>
      <td>{{ $t('txt.gps.info.course') }}:</td>
      <td class="overflow-hidden">{{ GPS.dir.value }}º</td>
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

.dark-theme .gps-info,
.body--dark .gps-info {
  background-color: rgba(24, 25, 26, 0.7);
  color: #a9b4cc;
  border-color: #a9b4cc;
}

.light-theme .gps-info,
.body--light .gps-info {
  background-color: rgba(245, 245, 245, 0.7);
  color: #464646;
  border-color: #464646;
}
</style>
