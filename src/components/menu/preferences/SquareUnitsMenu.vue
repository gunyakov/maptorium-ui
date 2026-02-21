<template>
  <q-menu anchor="top end" self="top start">
    <q-list>
      <q-item
        v-for="unit in squareUnits"
        :key="unit"
        dense
        clickable
        @click="setSquareUnit(unit)"
        :class="{
          'bg-primary': settings.square.includes(unit),
          'text-white': settings.square.includes(unit),
        }"
      >
        <q-item-section>{{ $t(`distance.square_units.${unit}`) }}</q-item-section>
      </q-item>
    </q-list>
  </q-menu>
</template>

<script setup lang="ts">
import { SquareUnits } from 'src/enum';
import { useSettingsStore } from 'src/stores/settings';

const settings = useSettingsStore();

const squareUnits = Object.keys(SquareUnits).filter((key) =>
  Number.isNaN(Number(key)),
) as Array<keyof typeof SquareUnits>;

const setSquareUnit = (unit: keyof typeof SquareUnits) => {
  settings.set_square(unit);
};
</script>
