<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin" style="min-width: 320px; max-width: 90vw">
      <q-card-section class="text-h6">
        {{ t('menu.view.poi_manager_actions.move') }}
      </q-card-section>

      <q-card-section>
        <q-select
          v-model="selectedValue"
          :options="options"
          emit-value
          map-options
          outlined
          dense
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
import { ref } from 'vue';
import { useDialogPluginComponent } from 'quasar';
import type { ModalsList } from 'src/composables/useDialogs';
import { useI18n } from 'vue-i18n';

interface MoveOption {
  label: string;
  value: string;
}

const { t } = useI18n();

const props = defineProps<{
  modalName: ModalsList;
  options: Array<MoveOption>;
  model: string;
}>();

defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

const options = ref<Array<MoveOption>>(props.options ?? []);
const selectedValue = ref<string>(props.model ?? 'root');

function onOKClick() {
  onDialogOK({ data: selectedValue.value });
}
</script>
