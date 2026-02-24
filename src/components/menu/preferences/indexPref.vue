<template>
  <q-menu anchor="top end" self="top start">
    <q-list>
      <!--Start Language menu with sub menu-->
      <q-item clickable dense>
        <q-item-section>{{ $t('menu.file.preferences.language') }}</q-item-section>
        <q-item-section side>
          <q-icon name="keyboard_arrow_right" />
        </q-item-section>
        <LanguageMenu />
      </q-item>
      <!--End Language menu with sub menu-->
      <!--Start Network Mode menu with sub menu-->
      <q-item clickable dense>
        <q-item-section>{{ $t('menu.file.preferences.network_mode.root') }}</q-item-section>
        <q-item-section side>
          <q-icon name="keyboard_arrow_right" />
        </q-item-section>
        <NetworkModeMenu />
      </q-item>
      <!--End Network Mode menu with sub menu-->
      <!--Start Units menu with sub menu-->
      <q-item clickable dense>
        <q-item-section>{{ $t('dialog.gps.distance_to_go.units') }}</q-item-section>
        <q-item-section side>
          <q-icon name="keyboard_arrow_right" />
        </q-item-section>
        <UnitsMenu />
      </q-item>
      <!--End Units menu with sub menu-->
      <!--Start Square Units menu with sub menu-->
      <q-item clickable dense>
        <q-item-section>{{ $t('dialog.gps.distance_to_go.square_units') }}</q-item-section>
        <q-item-section side>
          <q-icon name="keyboard_arrow_right" />
        </q-item-section>
        <SquareUnitsMenu />
      </q-item>
      <!--End Square Units menu with sub menu-->
      <!--Start Backup menu with sub menu-->
      <q-item clickable dense>
        <q-item-section>{{ $t('menu.file.preferences.backup.root') }}</q-item-section>
        <q-item-section side>
          <q-icon name="keyboard_arrow_right" />
        </q-item-section>
        <BackupMenu />
      </q-item>
      <!--End Backup menu with sub menu-->
    </q-list>
  </q-menu>
</template>
<script setup lang="ts">
import BackupMenu from './BackupMenu.vue';
import LanguageMenu from './LanguageMenu.vue';
import NetworkModeMenu from './NetworkModeMenu.vue';
import SquareUnitsMenu from './SquareUnitsMenu.vue';
import UnitsMenu from './UnitsMenu.vue';
</script>
