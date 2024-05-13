<script setup lang="ts">
defineProps<{
  length: string
}>()
</script>
<template>
  <hr :width="length" />
</template>
