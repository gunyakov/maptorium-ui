<script setup lang="ts">
import Lang from '@/lang/index'
import FormLine from '@/components/elements/FormLine.vue'
import InputFile from '@/components/elements/InputFile.vue'
const emit = defineEmits(['update'])
</script>
<template>
  <FormLine>
    <InputFile
      @update="
        (value: string) => {
          emit('update', value)
        }
      "
      >{{ Lang.TXT_GPS_ROUTE_FROM_FILE }}</InputFile
    >
  </FormLine>
</template>
