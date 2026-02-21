<template>
  <div class="q-ml-md cursor-pointer non-selectable">
    {{ $t('menu.draw.root') }}
    <q-menu auto-close>
      <q-list dense style="min-width: 100px">
        <q-item
          clickable
          v-close-popup
          @click="drawer.startPoint()"
          :class="{ 'bg-primary': activeDrawMenuItem === 'point', 'text-white': activeDrawMenuItem === 'point' }"
        >
          <q-item-section>{{ $t('menu.draw.point') }}</q-item-section>
        </q-item>
        <q-item
          clickable
          v-close-popup
          @click="drawer.startPolyline()"
          :class="{ 'bg-primary': activeDrawMenuItem === 'polyline', 'text-white': activeDrawMenuItem === 'polyline' }"
        >
          <q-item-section>{{ $t('menu.draw.polyline') }}</q-item-section>
        </q-item>
        <q-item
          clickable
          v-close-popup
          @click="drawer.startPolygon()"
          :class="{ 'bg-primary': activeDrawMenuItem === 'polygon', 'text-white': activeDrawMenuItem === 'polygon' }"
        >
          <q-item-section>{{ $t('menu.draw.polygon') }}</q-item-section>
        </q-item>
        <q-item
          clickable
          v-close-popup
          @click="drawer.startTileSquare()"
          :class="{
            'bg-primary': activeDrawMenuItem === 'tile_square',
            'text-white': activeDrawMenuItem === 'tile_square',
          }"
        >
          <q-item-section>{{ $t('menu.draw.tile_square') }}</q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </div>
</template>

<script setup lang="ts">
import { activeDrawMenuItem, drawer } from 'src/map/Drawer';
</script>
