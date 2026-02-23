<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useCachedMapBar } from 'src/composables/useCachedMapBar';

const { t } = useI18n();
const { tiles, total, show, progressRatio, percentage} = useCachedMapBar();

const progressText = computed(() => t('txt.cached_map.progress', { checked: tiles.value, total: total.value }));
const percentText = computed(() => `${percentage.value}%`);
</script>

<template>
  <q-slide-transition>
    <div v-if="show" class="cached-map-bar">
      <q-card bordered class="bg-grey-9 text-white shadow-4">
        <q-card-section class="row items-start no-wrap q-gutter-sm">
          <div class="col">
            <div class="text-subtitle2 text-weight-medium">
              {{ t('txt.cached_map.title') }}
            </div>
            <div class="row items-center no-wrap q-gutter-sm q-mt-sm">
              <div class="col">
                <q-linear-progress
                size="10px"
                  :value="progressRatio"
                  color="primary"
                  track-color="grey-7"
                  rounded
                  animation-speed="300"
                  stripe
                />
              </div>
              <div class="text-caption text-weight-bold">
                {{ percentText }}
              </div>
            </div>
            <div class="text-caption text-grey-3 q-mt-xs">
              {{ progressText }}
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-slide-transition>
</template>

<style scoped>
.cached-map-bar {
  position: absolute;
  right: 12px;
  bottom: 42px;
  max-width: 360px;
  width: calc(100% - 24px);
  pointer-events: none;
  z-index: 5;
}

.cached-map-bar .q-card {
  pointer-events: auto;
}

@media (max-width: 599px) {
  .cached-map-bar {
    right: 8px;
    left: 8px;
    width: auto;
  }
}
</style>
