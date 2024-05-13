<script setup lang="ts">
defineProps<{
  id: string
}>()
</script>
<template>
  <div width="100%" class="tab-content text-muted" :id="id"><slot></slot></div>
</template>
