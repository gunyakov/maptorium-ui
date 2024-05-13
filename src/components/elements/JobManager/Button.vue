<script setup lang="ts">
defineProps<{
  icon?: string
}>()
</script>
<template>
  <button type="button" class="btn btn-primary">
    <i class="font-size-16 align-middle" :class="icon"></i>
    <slot></slot>
  </button>
</template>
