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
                    :class="{
                      'bg-primary': maps.currentBaseMap.value == subItem.id,
                      'text-white': maps.currentBaseMap.value == subItem.id,
                    }"
                  >
                    <q-item-section>{{ subItem.name }}</q-item-section>
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
              :class="{
                'bg-primary': maps.currentBaseMap.value == item.id,
                'text-white': maps.currentBaseMap.value == item.id,
              }"
            >
              <q-item-section>{{ item.name }}</q-item-section>
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
const maps = useMapsList();
</script>
