<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-section class="text-h6">{{ dialogTitle }}</q-card-section>
      <q-card-section>
        <q-file
          v-model="model"
          rounded
          outlined
          bottom-slots
          :label="t('dialog.gps.route_from_file.label')"
          counter
          max-files="1"
          accept=".csv,.txt,text/csv,text/plain"
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
            {{ t('dialog.gps.route_from_file.hint') }}
          </template>
        </q-file>
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
import { useI18n } from 'vue-i18n';
import type { ModalsList } from 'src/composables/useDialogs';

const { t } = useI18n();
const model: Ref<File | null> = ref(null);

const props = defineProps<{
  modalName: ModalsList;
}>();

const dialogTitle = computed(() => t(`dialog.${props.modalName}.title`));

defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

function onOKClick() {
  onDialogOK({ data: model.value });
}
</script>
