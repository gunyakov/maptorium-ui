<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" backdrop-filter="blur(4px) grayscale(100%)">
    <q-card class="q-dialog-plugin">
      <q-card-section class="text-h6">{{ dialogTitle }}</q-card-section>
      <q-card-section>
        <q-select
          v-model="GPS.data.value.type"
          :options="gpsTypeOptions"
          :label="t('txt.gps.type.label')"
          emit-value
          map-options
        />
        <template v-if="GPS.data.value.type == GPSType.tcp">
          <q-input v-model="GPS.data.value.host" :label="t('dialog.gps.config.host')" />
          <q-input v-model="GPS.data.value.port" :label="t('dialog.gps.config.port')" />
        </template>
        <template v-else-if="GPS.data.value.type == GPSType.usb">
          <q-input v-model="GPS.data.value.device" :label="t('dialog.gps.config.device')" />
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
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useDialogPluginComponent } from 'quasar';
import { useGPS } from 'src/composables/useGPS';
import type { ModalsList } from 'src/composables/useDialogs';
import { GPSType } from 'src/enum';

const { t } = useI18n();
const GPS = useGPS();
const props = defineProps<{
  modalName: ModalsList;
}>();
const dialogTitle = computed(() => t(`dialog.${props.modalName}.title`));
const gpsTypeOptions = computed(() =>
  GPS.options.map((type) => ({
    label: type === GPSType.tcp ? t('txt.gps.type.tcp') : t('txt.gps.type.usb'),
    value: type,
  })),
);

defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

function onOKClick() {
  onDialogOK({ data: GPS.data.value });
}
</script>
