<script setup lang="ts">
import Lang from '@/lang/index'
defineProps<{
  id: string
  closeBtn?: boolean
  actionBtn?: boolean
}>()
const emit = defineEmits(['submit'])
</script>
<template>
  <div
    :id="id"
    class="modal modal-dialog-centered fade"
    tabindex="-1"
    data-bs-scroll="true"
    style="display: none"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title"><slot></slot></h5>
          <slot name="tabs"></slot>
          <button
            v-if="!closeBtn"
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <slot name="body"></slot>
        </div>
        <div v-if="actionBtn || closeBtn" class="modal-footer">
          <button v-if="closeBtn" type="button" class="btn btn-secondary" data-bs-dismiss="modal">
            {{ Lang.BTN_CANCEL }}
          </button>
          <button
            v-if="actionBtn"
            type="button"
            class="btn btn-primary"
            data-bs-dismiss="modal"
            @click="emit('submit')"
          >
            {{ Lang.BTN_SUBMIT }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
