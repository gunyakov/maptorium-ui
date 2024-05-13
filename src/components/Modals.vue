<script setup lang="ts">
import { Modals, ModalsList } from '@/API/Modals'
import Lang from '@/lang/index'
import FormCategoryConfig from '@/components/forms/CategoryConfig.vue'
import FormPOIProperties from '@/components/forms/POIConfig.vue'
import FormCachedMap from '@/components/forms/CachedMap.vue'
import FormDTG from '@/components/forms/DistanceToGo.vue'
import FormGPS from '@/components/forms/GPSConfig.vue'
let formData: any = false
</script>

<template>
  <div
    id="mapModal"
    class="modal modal-dialog-centered fade"
    tabindex="-1"
    data-bs-scroll="true"
    style="display: none"
    aria-hidden="false"
    aria-modal="true"
    role="dialog"
  >
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ Modals.modalTitle }}</h5>

          <button
            type="button"
            class="btn-close"
            @click="Modals.hide(false)"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <FormCategoryConfig
            v-if="Modals.modalKey.value == ModalsList.CategoryConfig"
            @update="(value) => (formData = value)"
            :defaults="Modals.defaults"
          ></FormCategoryConfig>
          <FormPOIProperties
            v-if="Modals.modalKey.value == ModalsList.POIConfig"
            @update="(value) => (formData = value)"
            :defaults="Modals.defaults"
          ></FormPOIProperties>
          <FormCachedMap
            v-if="Modals.modalKey.value == ModalsList.CachedMap"
            @update="(value) => (formData = value)"
          ></FormCachedMap>
          <FormDTG
            v-if="Modals.modalKey.value == ModalsList.DistanceToGO"
            @update="(value) => (formData = value)"
            :defaults="Modals.defaults"
          ></FormDTG>
          <FormGPS
            v-if="Modals.modalKey.value == ModalsList.GPSConfig"
            @update="(value) => (formData = value)"
            :defaults="Modals.defaults"
          ></FormGPS>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="Modals.hide(false)">
            {{ Lang.BTN_CANCEL }}
          </button>
          <button type="button" class="btn btn-primary" @click="Modals.hide(formData)">
            {{ Lang.BTN_SUBMIT }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
