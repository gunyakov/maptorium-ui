<template>
  <q-menu anchor="top end" self="top start">
    <q-list>
      <q-item dense clickable v-close-popup @click="exportBackup">
        <q-item-section>{{ $t('menu.file.preferences.backup.export') }}</q-item-section>
      </q-item>
      <q-item dense clickable v-close-popup @click="importBackup">
        <q-item-section>{{ $t('menu.file.preferences.backup.import') }}</q-item-section>
      </q-item>
    </q-list>
  </q-menu>
</template>

<script setup lang="ts">
import { usePOIBackup } from 'src/composables/usePOIBackup';

const { exportBackup, importBackup } = usePOIBackup();
</script>
