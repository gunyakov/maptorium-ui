<template>
  <q-menu anchor="top end" self="top start">
    <q-list>
      <q-item
        dense
        clickable
        v-close-popup
        v-for="networkMode in networkModes"
        :key="networkMode"
        @click="set(networkMode)"
        :class="{
          'bg-primary': mode === networkMode,
          'text-white': mode === networkMode,
        }"
      >
        <q-item-section>{{ $t(`menu.file.preferences.network_mode.${networkMode}`) }}</q-item-section>
      </q-item>
    </q-list>
  </q-menu>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { useNetworkMode } from 'src/composables/useNetworkMode';
import { NetworkMode } from 'src/enum';

const { set, mode } = useNetworkMode();

const networkModes = computed<NetworkMode[]>(() => {
  return Object.values(NetworkMode).filter((item) => item !== NetworkMode.null);
});
</script>
