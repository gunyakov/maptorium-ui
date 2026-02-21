<template>
  <div class="cursor-pointer non-selectable">
    {{ $t('menu.file.root') }}
    <q-menu>
      <q-list dense style="min-width: 100px">
        <q-item clickable v-close-popup>
          <q-item-section>Open...</q-item-section>
        </q-item>
        <q-item clickable v-close-popup>
          <q-item-section>New</q-item-section>
        </q-item>

        <q-separator />

        <q-item clickable>
          <q-item-section>{{ $t('menu.file.preferences.root') }}</q-item-section>
          <q-item-section side>
            <q-icon name="keyboard_arrow_right" />
          </q-item-section>
          <PreferencesMenu />
        </q-item>

        <q-separator />

        <q-item clickable v-close-popup>
          <q-item-section>{{ $t('menu.file.quit') }}</q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </div>
</template>
<script setup lang="ts">
import PreferencesMenu from './preferences/indexPref.vue';
</script>
