<script setup lang="ts">
defineProps<{
  disabled?: boolean
}>()
import Lang from '@/lang/index'
import { ref, watch } from 'vue'

const name = ref('')
const password = ref('')
const emit = defineEmits(['update'])
watch(name, async (newValue) => {
  emit('update', { name: newValue, password: password.value })
})
watch(password, async (newValue) => {
  emit('update', { name: name.value, password: newValue })
})
</script>
<template>
  <div class="input-group">
    <input
      type="text"
      class="form-control"
      :placeholder="Lang.TXT_USERNAME"
      :aria-label="Lang.TXT_USERNAME"
      v-model="name"
      :disabled="disabled"
    />
    <span class="input-group-text">@</span>
    <input
      type="text"
      class="form-control"
      :placeholder="Lang.TXT_PASSWORD"
      :aria-label="Lang.TXT_PASSWORD"
      v-model="password"
      :disabled="disabled"
    />
  </div>
</template>
