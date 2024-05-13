<script setup lang="ts">
defineProps<{
  disabled?: boolean
}>()
import { ref, watch } from 'vue'

const model = ref('')
const emit = defineEmits(['update'])
watch(model, async (newValue) => {
  emit('update', newValue)
})
</script>
<template>
  <input type="date" class="form-control" :disabled="disabled" v-model="model" />
</template>
