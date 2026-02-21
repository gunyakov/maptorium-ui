<template>
  <q-menu anchor="top end" self="top start">
    <q-list>
      <q-item
        dense
        clickable
        v-close-popup
        v-for="unit in distanceUnits"
        :key="unit"
        @click="setUnits(unit)"
        :class="{
          'bg-primary': settings.units === unit,
          'text-white': settings.units === unit,
        }"
      >
        <q-item-section>{{ $t(`distance.units.${unit}`) }}</q-item-section>
      </q-item>
    </q-list>
  </q-menu>
</template>

<script setup lang="ts">
import GPS from 'src/API/GPS';
import { DistanceUnits } from 'src/enum';
import { useSettingsStore } from 'src/stores/settings';

const settings = useSettingsStore();

const distanceUnits = Object.keys(DistanceUnits).filter((key) => Number.isNaN(Number(key))) as Array<
  keyof typeof DistanceUnits
>;

const setUnits = (units: keyof typeof DistanceUnits) => {
  settings.set_units(units);
  GPS.setUnits(units);
};
</script>
