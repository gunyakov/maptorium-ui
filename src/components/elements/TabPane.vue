<script setup lang="ts">
defineProps<{
  id: string
  active?: boolean
}>()
</script>
<template>
  <div class="tab-pane" :class="{ active: active }" :id="id" role="tabpanel">
    <slot></slot>
  </div>
</template>
