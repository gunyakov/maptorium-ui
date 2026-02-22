<script setup lang="ts">
import { useInfoBar } from 'src/composables/useInfoBar';

const infoBar = useInfoBar();
</script>

<template>
  <table class="info-bar">
    <tr>
      <td style="width: 18px">Z{{ infoBar.zoom }}</td>
      <td width="fit-content">&nbsp;Queue: {{ infoBar.queue }}&nbsp;</td>
      <td width="fit-content">&nbsp;Downloaded {{ infoBar.download }} ({{ infoBar.size }})</td>
      <td width="120px">{{ infoBar.lat }}</td>
      <td width="120px">{{ infoBar.lng }}</td>
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
}

.dark-theme .info-bar,
.body--dark .info-bar {
  background-color: rgba(24, 25, 26, 0.7);
  color: #a9b4cc;
}

.light-theme .info-bar,
.body--light .info-bar {
  background-color: rgba(245, 245, 245, 0.7);
  color: #464646;
}
</style>
