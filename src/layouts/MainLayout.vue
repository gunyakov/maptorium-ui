<template>
  <q-layout view="hHh lpr fFf" class="shadow-2 rounded-borders">
    <q-header elevated>
      <q-bar class="q-electron-drag">
        <q-icon name="img:icons/favicon-32x32.png" />

        <div>Maptorium</div>

        <q-space />

        <q-btn dense flat icon="minimize" @click="minimize()" />
        <q-btn dense flat icon="crop_square" @click="toggleMaximize()" />
        <q-btn dense flat icon="close" @click="closeApp()" />
      </q-bar>
      <TopBarMenuComponent />
    </q-header>

    <q-drawer v-model="jobManagerOpen" bordered show-if-above :width="320">
      <JobManager />
    </q-drawer>

    <q-drawer v-model="poiManagerOpen" side="right" bordered show-if-above :width="320">
      <POIManager />
    </q-drawer>

    <q-page-container :style="{ height: `calc(100vh - 0px)` }">
      <MapComponent />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { computed, nextTick, watch } from 'vue';
import MapComponent from 'src/components/MapComponent.vue';
import POIManager from 'src/components/POIManager.vue';
import JobManager from 'src/components/JobManager.vue';
import TopBarMenuComponent from 'src/components/TopBarMenuComponent.vue';
import { useSettingsStore } from 'src/stores/settings';
import { getMap } from 'src/map/Map';
import { useWindowControls } from 'src/composables/useWindowControl';

const { minimize, toggleMaximize, closeApp } = useWindowControls();

declare global {
  interface Window {
    appControls?: {
      minimize: () => void;
      toggleMaximize: () => void;
      close: () => void;
    };
  }
}

const settingsStore = useSettingsStore();

const jobManagerOpen = computed({
  get: () => settingsStore.jobManager,
  set: (value: boolean) => settingsStore.set_jobManager(value),
});

const poiManagerOpen = computed({
  get: () => settingsStore.poiManager,
  set: (value: boolean) => settingsStore.set_poiManager(value),
});

function resizeMapAfterDrawerChange() {
  const resize = () => {
    try {
      const map = getMap().init();
      map?.resize();
    } catch {
      return;
    }
  };

  void nextTick(() => {
    resize();
    window.setTimeout(resize, 320);
  });
}

watch([jobManagerOpen, poiManagerOpen], () => {
  resizeMapAfterDrawerChange();
});
</script>
