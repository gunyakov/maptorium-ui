<script setup lang="ts">
defineProps<{
  row?: boolean
}>()
</script>
<template>
  <div class="row mb-10">
    <div v-if="!row" class="col-sm-12">
      <slot></slot>
    </div>
    <slot v-else></slot>
  </div>
</template>
