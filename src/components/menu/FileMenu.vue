<template>
  <div class="cursor-pointer non-selectable">
    {{ $t('menu.file.root') }}
    <q-menu>
      <q-list dense style="min-width: 100px">
        <q-item clickable v-close-popup @click="forceReloadMap">
          <q-item-section>{{ $t('menu.file.forceReload') }}</q-item-section>
        </q-item>

        <q-separator />

        <q-item clickable>
          <q-item-section>{{ $t('menu.file.preferences.root') }}</q-item-section>
          <q-item-section side>
            <q-icon name="keyboard_arrow_right" />
          </q-item-section>
          <PreferencesMenu />
        </q-item>

        <q-separator />

        <q-item clickable v-close-popup @click="closeApp">
          <q-item-section>{{ $t('menu.file.quit') }}</q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </div>
</template>
<script setup lang="ts">
import PreferencesMenu from './preferences/indexPref.vue';
import { useWindowControls } from 'src/composables/useWindowControl';
import { getMap } from 'src/map/Map';
import Alerts from 'src/alerts';
const { closeApp } = useWindowControls();

const forceReloadMap = () => {
  Alerts.showLoading('txt.initializing');
  try {
    const Map = getMap();
    Map.forceReload();
  } catch (error) {
    console.error('Failed to force reload map', error);
  } finally {
    Alerts.hideLoading();
  }
};
</script>
