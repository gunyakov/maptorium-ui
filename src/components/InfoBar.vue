<script setup lang="ts">
import InfoBar from '@/API/InfoBar'
</script>
<template>
  <table class="info-bar">
    <tr>
      <td style="width: 18px">Z{{ InfoBar.zoom }}</td>
      <td width="fit-content">&nbsp;Queue: {{ InfoBar.queue }}&nbsp;</td>
      <td width="fit-content">&nbsp;Downloaded {{ InfoBar.download }} ({{ InfoBar.size }})</td>
      <td width="120px">{{ InfoBar.lat }}</td>
      <td width="120px">{{ InfoBar.lng }}</td>
    </tr>
  </table>
</template>
<style>
.info-bar {
  position: absolute;
  height: 18px;
  bottom: 0px;
  width: 100%;
  background-color: rgba(7, 23, 57, 0.7);
  color: #c8d4f0;
  backdrop-filter: blur(3px);
  font-size: x-small;
  backdrop-filter: blur(3px);
}

.dark-theme .info-bar {
  background-color: rgba(24, 25, 26, 0.7);
  color: #a9b4cc;
}

.light-theme .info-bar {
  background-color: rgba(245, 245, 245, 0.7);
  color: #464646;
}
</style>
