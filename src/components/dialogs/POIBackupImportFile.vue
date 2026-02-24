<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-section class="text-h6">
        {{ t('dialog.poi.backup.import.title') }}
      </q-card-section>
      <q-card-section>
        <q-file
          v-model="model"
          rounded
          outlined
          bottom-slots
          :label="t('dialog.poi.backup.import.file_label')"
          counter
          max-files="1"
          accept=".mpb,.json,application/json"
        >
          <template #before>
            <q-icon name="attachment" />
          </template>

          <template #append>
            <q-icon
              v-if="model !== null"
              name="close"
              class="cursor-pointer"
              @click.stop.prevent="model = null"
            />
            <q-icon name="search" @click.stop.prevent />
          </template>

          <template #hint>
            {{ t('dialog.poi.backup.import.hint') }}
          </template>
        </q-file>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn color="primary" :label="t('dialog.actions.ok')" :disable="model == null" @click="onOKClick" />
        <q-btn color="primary" :label="t('dialog.actions.cancel')" @click="onDialogCancel" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, type Ref } from 'vue';
import { useDialogPluginComponent } from 'quasar';
import { useI18n } from 'vue-i18n';
import type { ModalsList } from 'src/composables/useDialogs';

const { t } = useI18n();
const model: Ref<File | null> = ref(null);

defineProps<{
  modalName: ModalsList;
}>();

defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

function onOKClick() {
  if (!model.value) return;
  onDialogOK({ data: model.value });
}
</script>
