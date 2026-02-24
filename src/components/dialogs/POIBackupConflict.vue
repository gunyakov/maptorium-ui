<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin" style="min-width: 360px; max-width: 92vw">
      <q-card-section class="text-h6">
        {{ t('dialog.poi.backup.conflict.title') }}
      </q-card-section>

      <q-card-section>
        {{ t('dialog.poi.backup.conflict.message', { name: poiName }) }}
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-checkbox
          v-model="applyForAll"
          :label="t('dialog.poi.backup.conflict.apply_for_all')"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat color="primary" :label="t('dialog.poi.backup.conflict.skip')" @click="skipPOI" />
        <q-btn color="primary" :label="t('dialog.poi.backup.conflict.rewrite')" @click="rewritePOI" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useDialogPluginComponent } from 'quasar';
import { useI18n } from 'vue-i18n';
import type { ModalsList } from 'src/composables/useDialogs';

const { t } = useI18n();
const applyForAll = ref(false);

const props = defineProps<{
  modalName: ModalsList;
  poiName: string;
}>();

defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent();

const poiName = props.poiName;

function skipPOI() {
  onDialogOK({
    data: {
      rewrite: false,
      applyForAll: applyForAll.value,
    },
  });
}

function rewritePOI() {
  onDialogOK({
    data: {
      rewrite: true,
      applyForAll: applyForAll.value,
    },
  });
}
</script>
