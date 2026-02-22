<template>
  <div v-if="visible" class="route-hover-measure-overlay">
    <q-card class="bg-primary text-white">
      <q-card-section class="q-py-sm q-px-md">
        <div v-if="name" class="text-weight-bold q-mb-xs">{{ $t('menu.draw.measure.name') }}</div>
        <div v-if="name">{{ name }}</div>
        <div class="text-weight-bold" :class="{ 'q-mt-sm': !!name }">
          {{ $t('menu.draw.measure.total') }}: {{ total }}
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { useRouteHoverMeasure } from 'src/composables/useRouteHoverMeasure';

const { visible, name, total } = useRouteHoverMeasure();
</script>

<style scoped>
.route-hover-measure-overlay {
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 5;
  min-width: 220px;
  max-width: 320px;
  pointer-events: none;
}
</style>
