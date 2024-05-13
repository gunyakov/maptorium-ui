<script setup lang="ts">
defineProps<{
  dsmCancel?: boolean
}>()
</script>
<template>
  <button
    type="button"
    class="btn btn-outline-primary waves-effect waves-light"
    :data-bs-dismiss="!dsmCancel ? 'modal' : ''"
  >
    <slot></slot>
  </button>
</template>
