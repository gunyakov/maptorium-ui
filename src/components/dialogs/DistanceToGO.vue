<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-section class="text-h6">{{ dialogTitle }}</q-card-section>
      <q-card-section>
        <q-input v-model="data.distance" :label="t('dialog.gps.distance_to_go.descr')" />
        <q-select
          v-model="data.units"
          :options="distanceUnitOptions"
          :label="t('dialog.gps.distance_to_go.units')"
        />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn color="primary" :label="t('dialog.actions.ok')" @click="onOKClick" />
        <q-btn color="primary" :label="t('dialog.actions.cancel')" @click="onDialogCancel" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, ref, type Ref } from 'vue';
import { useDialogPluginComponent } from 'quasar';
import type { ModalsList } from 'src/composables/useDialogs';
import { useI18n } from 'vue-i18n';
import { DistanceUnits } from 'src/enum';
const { t } = useI18n();
interface DistanceToGo {
  distance: number;
  units: keyof typeof DistanceUnits;
}
const distanceUnitOptions = Object.keys(DistanceUnits)
  .filter((key) => Number.isNaN(Number(key)))
  .map((key) => ({
    label: t(`distance.units.${key}`),
    value: key,
  }));
const data: Ref<DistanceToGo> = ref({
  distance: 0,
  units: 'meters' as keyof typeof DistanceUnits,
});
const props = defineProps<{
  modalName: ModalsList;
}>();
const dialogTitle = computed(() => t(`dialog.${props.modalName}.title`));
defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();
function onOKClick() {
  onDialogOK({ data: data.value });
}
</script>
