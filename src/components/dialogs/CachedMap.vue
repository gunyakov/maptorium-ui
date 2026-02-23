<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" :maximized="$q.screen.lt.sm">
    <q-card class="q-dialog-plugin">
      <q-card-section class="text-h6">{{ dialogTitle }}</q-card-section>

      <q-card-section class="q-gutter-md">
        <q-select
          v-model="selectedMap"
          :options="mapOptions"
          emit-value
          map-options
          outlined
          dense
          :label="t('dialog.cached_map.main.map')"
        />

        <q-select
          v-model="selectedZoom"
          :options="zoomOptions"
          emit-value
          map-options
          outlined
          dense
          :label="t('dialog.cached_map.main.zoom')"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          color="primary"
          :disable="!canSubmit"
          :label="t('dialog.actions.ok')"
          @click="onOKClick"
        />
        <q-btn flat color="primary" :label="t('dialog.actions.cancel')" @click="onDialogCancel" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useDialogPluginComponent } from 'quasar';
import { useI18n } from 'vue-i18n';
import type { ModalsList } from 'src/composables/useDialogs';
import { useMapsList } from 'src/composables/useMapsList';

const props = defineProps<{
  modalName: ModalsList;
  polygonID: number;
  polygonPoints: Array<{ lat: number; lng: number }>;
}>();

const { t } = useI18n();
const mapsList = useMapsList();
const selectedMap = ref('');
const selectedZoom = ref<number | null>(null);

onMounted(async () => {
  if (!mapsList.rawMapsList.value.length) {
    await mapsList.refresh();
  }
  if (!selectedMap.value) {
    selectedMap.value = mapsList.currentBaseMap.value || mapsList.rawMapsList.value[0]?.id || '';
  }
  if (selectedZoom.value === null) {
    selectedZoom.value = 12;
  }
});

const mapOptions = computed(() =>
  mapsList.rawMapsList.value.map((item) => ({
    label: item.title || item.name,
    value: item.id,
  })),
);

const zoomOptions = computed(() =>
  Array.from({ length: 17 }, (_, index) => 4 + index).map((zoom) => ({
    label: `Z${zoom < 10 ? '0' : ''}${zoom}`,
    value: zoom,
  })),
);

const dialogTitle = computed(() => t(`dialog.${props.modalName}.title`));
const canSubmit = computed(() => Boolean(selectedMap.value) && Number.isFinite(selectedZoom.value));

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();
function onOKClick() {
  if (!canSubmit.value || selectedZoom.value === null) return;
  onDialogOK({
    data: {
      mapID: selectedMap.value,
      zoom: selectedZoom.value,
      polygonID: props.polygonID,
      polygonPoints: props.polygonPoints,
    },
  });
}
</script>
