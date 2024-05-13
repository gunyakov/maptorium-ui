<script setup lang="ts">
defineProps<{
  full?: boolean
}>()
const emit = defineEmits(['add', 'edit', 'remove'])
</script>
<template>
  <div class="float-end">
    <i
      v-if="full"
      class="me-1 cursor-pointer text-success fas fa-plus"
      @click.stop="emit('add')"
    ></i>
    <i class="me-1 cursor-pointer text-warning fas fa-edit" @click.stop="emit('edit')"></i>
    <i class="me-1 cursor-pointer text-danger fas fa-trash" @click.stop="emit('remove')"></i>
  </div>
</template>
