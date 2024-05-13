<script setup lang="ts">
import { ref } from 'vue'
import Buttons from '@/components/elements/POIManager/Buttons.vue'
defineProps<{
  icon?: string
}>()

const buttons = ref(false)
const emit = defineEmits(['add', 'remove', 'edit'])
</script>
<template>
  <li @mouseenter="buttons = true" @mouseleave="buttons = false">
    <div class="treeview-animated-element">
      <i v-if="icon" :class="icon" class="ic-w mr-1"></i><slot></slot>

      <Buttons
        v-if="buttons"
        :full="false"
        @add="emit('add')"
        @remove="emit('remove')"
        @edit="emit('edit')"
      />
    </div>
  </li>
</template>
