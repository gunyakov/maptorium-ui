<template>
  <!-- Start Main Layer menu list -->
  <div class="q-ml-md cursor-pointer non-selectable">
    {{ $t('menu.maps') }}
    <q-menu>
      <q-list dense style="min-width: 100px">
        <template v-for="(item, key) in maps.mapsListMenu.value" :key="key">
          <template v-if="Array.isArray(item)">
            <q-item clickable>
              <q-item-section>{{ key }}</q-item-section>
              <q-item-section side>
                <q-icon name="keyboard_arrow_right" />
              </q-item-section>

              <q-menu anchor="top end" self="top start">
                <q-list>
                  <q-item
                    dense
                    clickable
                    v-close-popup
                    v-for="(subItem, subKey) in item"
                    :key="subKey"
                    @click="maps.setBaseMap(subItem.id)"
                  >
                    <q-item-section side>
                      <q-icon v-if="maps.currentBaseMap.value == subItem.id" name="check" />
                    </q-item-section>
                    <q-item-section
                    >{{ subItem.name }}</q-item-section>
                    <q-item-section side>
                      <q-btn
                        flat
                        dense
                        round
                        icon="settings"
                        @click.stop="openStorageSettings(subItem)"
                      />
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-item>
          </template>
          <template v-else
            ><q-item
              clickable
              v-close-popup
              @click="maps.setBaseMap(item.id)"
            >
              <q-item-section side>
                <q-icon v-if="maps.currentBaseMap.value == item.id" name="check" />
              </q-item-section>
              <q-item-section
                :class="{
                  'bg-primary': maps.currentBaseMap.value == item.id,
                  'text-white': maps.currentBaseMap.value == item.id,
                }"
              >{{ item.name }}</q-item-section>
              <q-item-section side>
                <q-btn
                  flat
                  dense
                  round
                  icon="settings"
                  @click.stop="openStorageSettings(item)"
                />
              </q-item-section>
            </q-item></template
          >
        </template>
      </q-list>
    </q-menu>
  </div>
  <!-- End Main Layer menu list -->
</template>
<script setup lang="ts">
import { useMapsList } from 'src/composables/useMapsList';
import { ModalsList, useDialogs } from 'src/composables/useDialogs';
import request from 'src/API/ajax';
import Alerts from 'src/alerts';
import type { iMapItem } from 'src/interface';

const maps = useMapsList();
const dialogs = useDialogs();

const openStorageSettings = async (map: iMapItem) => {
  const payload: { mapID: string; mapName: string; currentPath?: string } = {
    mapID: map.id,
    mapName: map.name,
  };

  if (map.storagePath) payload.currentPath = map.storagePath;

  const path = await dialogs(ModalsList.FileTree, payload);

  if (!path) return;

  const isUpdated = await request('core.mapStorage', {
    mapID: map.id,
    path,
  }, 'post');

  if (!isUpdated) {
    Alerts.error('toast.storage.save_failed');
    return;
  }

  Alerts.success('toast.storage.updated');
  await maps.refresh();
};
</script>
