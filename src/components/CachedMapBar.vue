<script setup lang="ts">
import API from '@/API/index'
import Lang from '@/lang/index'
import { watch, ref } from 'vue'

const progress = ref('0%')

watch(API.cachedBarInfo, (value) => {
  progress.value = Math.floor((value.tiles / value.total) * 100).toString() + '%'
})
</script>
<template>
  <div class="cached-bar" :style="{ display: API.cachedBarShow.value ? 'block' : 'none' }">
    <div class="d-flex p-2">
      <div class="flex-grow-1 overflow-hidden me-3">
        <div class="progress animated-progess mb-2 mt-2">
          <div
            class="progress-bar bg-primary"
            role="progressbar"
            :style="{ width: progress }"
            :aria-valuenow="API.cachedBarInfo.value.tiles"
            aria-valuemin="0"
            :aria-valuemax="API.cachedBarInfo.value.total"
          ></div>
        </div>
        <p class="text-truncate font-size-13 text-muted mb-0">
          {{
            Lang.TXT_CHECKED +
            ' ' +
            API.cachedBarInfo.value.tiles +
            ' ' +
            Lang.TXT_FROM +
            ' ' +
            API.cachedBarInfo.value.total
          }}.
        </p>
      </div>
      <div class="flex-shrink-0 text-end">
        <button type="button" class="btn btn-primary" m-data="btn-cancel">
          <i class="mdi mdi-cancel font-size-16 align-middle"></i>
        </button>
      </div>
    </div>
  </div>
</template>
<style>
.cached-bar {
  max-width: 350px !important;
  width: 250px;
  position: absolute;
  right: 18px;
  bottom: 30px;
  background-color: rgba(7, 23, 57, 0.7);
  color: #c8d4f0;
  backdrop-filter: blur(3px);
}
.dark-theme .cached-bar {
  background-color: rgba(24, 25, 26, 0.7);
  color: #a9b4cc;
}

.light-theme .cached-bar {
  background-color: rgba(245, 245, 245, 0.7);
  color: #464646;
}
</style>
