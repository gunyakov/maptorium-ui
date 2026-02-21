<template>
  <q-menu anchor="top end" self="top start">
    <q-list>
      <q-item
        dense
        clickable
        v-close-popup
        v-for="language in languages"
        :key="language.code"
        @click="changeLocale(language.code)"
        :class="{
          'bg-primary': locale === language.code,
          'text-white': locale === language.code,
        }"
      >
        <q-item-section side>
          <q-icon :name="`img:/images/flags/${language.code}.svg`" />
        </q-item-section>
        <q-item-section>{{ language.label }}</q-item-section>
      </q-item>
    </q-list>
  </q-menu>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import messages from 'src/i18n';
import { useSettingsStore } from 'src/stores/settings';
const i18n = useI18n({ useScope: 'global' });
const locale = i18n.locale;
const settings = useSettingsStore();

const changeLocale = (code: string) => {
  locale.value = code;
  settings.set_locale(code);
};

const languages = computed(() => {
  return Object.keys(messages).map((code) => {
    const labelKey = `menu.file.preferences.${code}`;

    return {
      code,
      label: i18n.te(labelKey) ? i18n.t(labelKey) : code.toUpperCase(),
    };
  });
});
</script>
