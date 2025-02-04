<script setup lang="ts">
const emit = defineEmits(['update'])

function onFileChange(event: Event | DragEvent) {
  let files = (<HTMLInputElement>event.target)?.files || (event as DragEvent).dataTransfer?.files
  if (!files) {
    emit('update', false)
  } else if (!files.length) {
    emit('update', false)
  } else {
    // Read the file
    const reader = new FileReader()
    reader.onload = () => {
      emit('update', reader.result)
    }
    reader.onerror = () => {
      console.log('Error reading the file. Please try again.', 'error')
    }
    reader.readAsText(files[0])
  }
}
</script>
<template>
  <label for="formFile" class="form-label"><slot></slot></label>
  <input class="form-control" type="file" @change="onFileChange" />
</template>
