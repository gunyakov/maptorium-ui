<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" backdrop-filter="blur(4px) grayscale(100%)">
    <q-card class="q-dialog-plugin">
      <q-card-section class="text-h6">{{ dialogTitle }}</q-card-section>
      <q-card-section>
        <q-input
          filled
          v-model="color"
          :label="t('dialog.poi.properties.color')"
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
        <q-input v-model.number="width" :label="t('dialog.poi.properties.width')" type="number" min="1" />
        <template v-if="isPolygon">
          <q-input
            filled
            v-model="fillColor"
            :label="t('dialog.poi.properties.fill_color')"
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
          <q-input
            v-model.number="fillOpacity"
            :label="t('dialog.poi.properties.fill_opacity')"
            type="number"
            min="0"
            max="1"
            step="0.01"
          />
        </template>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn color="primary" :label="t('dialog.actions.ok')" @click="onOKClick" />
        <q-btn color="primary" :label="t('dialog.actions.cancel')" @click="onDialogCancel" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Feature, GeoJsonProperties, Geometry } from 'geojson';
import { useI18n } from 'vue-i18n';
import { useDialogPluginComponent } from 'quasar';
import type { ModalsList } from 'src/composables/useDialogs';

const { t } = useI18n();
const props = defineProps<{
  modalName: ModalsList;
  poi: Feature<Geometry, GeoJsonProperties>;
  modelValue?: boolean;
}>();

const dialogTitle = computed(() => t(`dialog.${props.modalName}.title`));
const isPolygon = computed(() => props.poi?.geometry?.type === 'Polygon');
const color = ref(props.poi?.properties?.color ?? '#0D99FF');
const width = ref(props.poi?.properties?.width ?? 1);
const fillColor = ref(props.poi?.properties?.fillColor ?? '#0D99FF');
const fillOpacity = ref(props.poi?.properties?.fillOpacity ?? 0.5);

defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

function onOKClick() {
  onDialogOK({
    data: {
      color: color.value,
      width: width.value,
      fillColor: isPolygon.value ? fillColor.value : undefined,
      fillOpacity: isPolygon.value ? fillOpacity.value : undefined,
    },
  });
}
</script>

<style scoped>
.q-input {
  margin-bottom: 12px;
}
</style>
