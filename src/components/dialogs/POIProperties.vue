<template>
  <q-dialog v-model="showDialog">
    <q-card>
      <q-card-section>
        <div class="text-h6">POI Properties</div>
        <q-input
          filled
          v-model="color"
          label="Color"
          class="my-input"
        >
          <template v-slot:append>
            <q-icon name="colorize" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-color v-model="color" />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <q-input v-model.number="width" label="Width" type="number" min="1" />
        <q-input
          filled
          v-model="fillColor"
          label="Fill Color"
          class="my-input"
        >
          <template v-slot:append>
            <q-icon name="colorize" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-color v-model="fillColor" />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <q-input v-model.number="fillOpacity" label="Fill Opacity" type="number" min="0" max="1" step="0.01" />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cancel"  @click="onDialogCancel" />
        <q-btn color="primary" label="OK" @click="onOKClick" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Feature, GeoJsonProperties, Geometry } from 'geojson';
import { useDialogPluginComponent } from 'quasar';
const props = defineProps<{ modelValue: boolean; poi: Feature<Geometry, GeoJsonProperties> }>();

const showDialog = ref(props.modelValue);
const color = ref(props.poi?.properties?.color || '#0D99FF');
const width = ref(props.poi?.properties?.width || 1);
const fillColor = ref(props.poi?.properties?.fillColor || '#0D99FF');
const fillOpacity = ref(props.poi?.properties?.fillOpacity || 0.5);

defineEmits([...useDialogPluginComponent.emits]);

const { onDialogOK, onDialogCancel } = useDialogPluginComponent();

function onOKClick() {
  onDialogOK({ data: {
    color: color.value,
    width: width.value,
    fillColor: fillColor.value,
    fillOpacity: fillOpacity.value
  } });
}
</script>

<style scoped>
.q-input {
  margin-bottom: 12px;
}
</style>
