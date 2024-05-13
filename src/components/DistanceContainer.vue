<script setup lang="ts">
import Lang from '@/lang/index'
import DrawerPanel from '@/API/DrawerPanel'
import API from '@/API'
</script>
<template>
  <div
    class="distance-container"
    :style="{
      display: DrawerPanel.visible.value ? 'block' : 'none'
    }"
  >
    <template v-for="(item, index) in DrawerPanel.distance.value" :key="index">
      <div class="col-12">
        {{ `${Lang.TXT_SEGMENT} ${index + 1}` }}:
        {{ Math.floor((item / API.GPS.units) * 100) / 100 }}
        {{ Lang[`TXT_UNIT_DISTANCE_${API.GPS.untisKey.toUpperCase()}`] }}
      </div>
    </template>
    <template v-if="DrawerPanel.distance.value.length > 1">
      <div class="col-12">
        {{ Lang.TXT_TOTAL }}:
        {{
          Math.floor(
            DrawerPanel.distance.value.reduce(
              (sum, item) => (sum += Math.floor((item / API.GPS.units) * 100) / 100),
              0
            )
          )
        }}
        {{ Lang[`TXT_UNIT_DISTANCE_${API.GPS.untisKey.toUpperCase()}`] }}
      </div>
    </template>
  </div>
</template>
<style>
.distance-container {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 20;
}

.distance-container > * {
  background-color: rgba(7, 23, 57, 0.7);
  color: #c8d4f0;
  backdrop-filter: blur(3px);
  font-size: small;
  line-height: 18px;
  display: block;
  margin: 0;
  padding: 5px 10px;
  border-radius: 3px;
}

.dark-theme .distance-container > * {
  background-color: rgba(24, 25, 26, 0.7);
  color: #a9b4cc;
}

.light-theme .distance-container > * {
  background-color: rgba(245, 245, 245, 0.7);
  color: #464646;
}
</style>
