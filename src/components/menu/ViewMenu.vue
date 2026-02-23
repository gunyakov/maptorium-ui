<template>
  <div class="q-ml-md cursor-pointer non-selectable">
    {{ $t('menu.view.root') }}
    <q-menu>
      <q-list dense style="min-width: 140px">
        <q-item clickable @click="toggleDarkMode()">
          <q-item-section>{{ $t('menu.view.dark_mode') }}</q-item-section>
          <q-item-section side>
            <q-toggle
              :model-value="settings.darkMode"
              dense
              @update:model-value="setDarkMode"
              @click.stop
            />
          </q-item-section>
        </q-item>
        <q-item clickable @click="toggleMapMode()">
          <q-item-section>{{ $t('menu.view.map_mode') }}</q-item-section>
          <q-item-section side>
            <q-toggle
              :model-value="settings.globe"
              dense
              @update:model-value="setMapMode"
              @click.stop
            />
          </q-item-section>
        </q-item>
        <q-separator />
        <q-item clickable v-close-popup @click="togglePOIManager()">
          <q-item-section>{{ $t('menu.view.poi_manager') }}</q-item-section>
          <q-item-section side>
            <q-icon v-if="settings.poiManager" name="check" />
          </q-item-section>
        </q-item>
        <q-item clickable v-close-popup @click="toggleGPSInfo()">
          <q-item-section>{{ $t('menu.view.gps_info') }}</q-item-section>
          <q-item-section side>
            <q-icon v-if="settings.gpsInfo" name="check" />
          </q-item-section>
        </q-item>
        <q-item clickable v-close-popup @click="toggleJobManager()">
          <q-item-section>{{ $t('menu.view.job_manager') }}</q-item-section>
          <q-item-section side>
            <q-icon v-if="settings.jobManager" name="check" />
          </q-item-section>
        </q-item>
        <q-separator />
        <q-item clickable>
          <q-item-section>{{ $t('menu.view.tile_grid') }}</q-item-section>
          <q-item-section side>
            <q-icon name="keyboard_arrow_right" />
          </q-item-section>

          <q-menu anchor="top end" self="top start">
            <div class="q-pa-sm tile-grid-menu">
              <div class="q-pa-xs tile-grid-buttons">
                <div v-for="value in gridOffsets" :key="value">
                  <q-btn
                    class="tile-grid-button"
                    dense
                    size="sm"
                    :outline="selectedOffset !== value"
                    :color="selectedOffset === value ? 'primary' : 'grey-7'"
                    @click="selectOffset(value)"
                  >
                    {{ value }}
                  </q-btn>
                </div>
              </div>

              <q-separator class="q-my-sm" />

              <div class="q-pa-xs tile-grid-buttons">
                <div v-for="value in zoomLevels" :key="value">
                  <q-btn
                    class="tile-grid-button"
                    dense
                    size="sm"
                    :outline="selectedZoom !== value"
                    :color="selectedZoom === value ? 'primary' : 'grey-7'"
                    @click="selectZoom(value)"
                  >
                    {{ value }}
                  </q-btn>
                </div>
              </div>
            </div>
          </q-menu>
        </q-item>
        <q-separator />
        <q-item clickable v-close-popup @click="clearTileGrid()">
          <q-item-section>{{ $t('menu.view.clear_tile_grid') }}</q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TileGrid from 'src/map/TileGrid';
import { getMap } from 'src/map/Map';
import { useSettingsStore } from 'src/stores/settings';

const gridOffsets = ['0', ...Array.from({ length: 7 }, (_, index) => `+${index + 1}`)];
const zoomLevels = Array.from({ length: 17 }, (_, index) => `Z${String(index + 4).padStart(2, '0')}`);

const selectedOffset = ref('0');
const selectedZoom = ref('Z04');
const settings = useSettingsStore();

function selectOffset(value: string) {
  selectedOffset.value = value;
  selectedZoom.value = '';
  TileGrid.setZoomOffset(Number(value.replace('+', '')));
}

function selectZoom(value: string) {
  selectedZoom.value = value;
  selectedOffset.value = '';
  TileGrid.setZoom(Number(value.replace('Z', '')));
}

function clearTileGrid() {
  selectedOffset.value = '';
  selectedZoom.value = '';
  TileGrid.remove();
}

function togglePOIManager() {
  settings.set_poiManager(!settings.poiManager);
}

function toggleGPSInfo() {
  settings.set_gpsInfo(!settings.gpsInfo);
}

function toggleJobManager() {
  settings.set_jobManager(!settings.jobManager);
}

function toggleDarkMode() {
  settings.set_darkMode(!settings.darkMode);
}

function setDarkMode(value: boolean) {
  settings.set_darkMode(value);
}

function toggleMapMode() {
  settings.set_globe(!settings.globe);
  const map = getMap();
  map.updateProjection();
}

function setMapMode(value: boolean) {
  settings.set_globe(value);
  const map = getMap();
  map.updateProjection();
}
</script>

<style scoped>
.tile-grid-menu {
  width: 250px;
}

.tile-grid-buttons {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 4px;
}

.tile-grid-button {
  width: 100%;
}
</style>
