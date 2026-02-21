<template>
  <!-- Start Layers menu list -->
  <div class="q-ml-md cursor-pointer non-selectable">
    {{ $t('menu.layers') }}
    <q-menu>
      <q-list dense style="min-width: 100px">
        <template v-for="(item, key) in maps.layersListMenu.value" :key="key">
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
                    v-for="(subItem, subKey) in item"
                    :key="subKey"
                    @click="maps.toggleLayer(subItem.id)"
                    :class="{
                      'bg-primary': maps.isLayer(subItem.id),
                      'text-white': maps.isLayer(subItem.id),
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
              @click="maps.toggleLayer(item.id)"
              :class="{
                'bg-primary': maps.isLayer(item.id),
                'text-white': maps.isLayer(item.id),
              }"
            >
              <q-item-section>{{ item.name }}</q-item-section>
            </q-item></template
          >
        </template>
      </q-list>
    </q-menu>
  </div>
  <!-- End Layers menu list -->
</template>
<script setup lang="ts">
import { useMapsList } from 'src/composables/useMapsList';
const maps = useMapsList();
</script>
