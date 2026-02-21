<template>
  <div v-if="visible" class="draw-measure-overlay">
    <q-card class="bg-primary text-white">
      <q-card-section class="q-py-sm q-px-md">
        <template v-if="name">
          <div class="text-weight-bold q-mb-xs">{{ $t('menu.draw.measure.name') }}</div>
          <div>{{ name }}</div>
        </template>

        <template v-if="segments.length > 0 || total || area || areas.length > 0">
          <div class="text-weight-bold q-mb-xs" :class="{ 'q-mt-sm': !!name }">
            {{ $t('menu.draw.measure.title') }}
          </div>
          <div v-for="segment in segments" :key="segment.label">
            {{ segment.label }}: {{ segment.value }}
          </div>
          <div v-if="total" class="text-weight-bold q-mt-xs">
            {{ $t('menu.draw.measure.total') }}: {{ total }}
          </div>
          <div v-if="area" class="text-weight-bold">
            {{ $t('menu.draw.measure.area') }}: {{ area }}
          </div>
          <div v-for="areaItem in areas" :key="areaItem.label" class="text-weight-bold">
            {{ areaItem.label }}: {{ areaItem.value }}
          </div>
        </template>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { useDrawMeasure } from 'src/composables/useDrawMeasure';

const { visible, name, segments, total, area, areas } = useDrawMeasure();
</script>

<style scoped>
.draw-measure-overlay {
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 4;
  min-width: 220px;
  max-width: 320px;
  pointer-events: none;
}
</style>
