<script setup lang="ts">
defineProps<{
  icon?: string
  target?: string
}>()
</script>
<template>
  <li class="dropdown">
    <a
      class="dropdown-item"
      role="button"
      :data-bs-toggle="target ? 'modal' : false"
      :data-bs-target="target"
      ><i v-if="icon" :class="icon"></i><span class="">&nbsp;<slot></slot></span
    ></a>
  </li>
</template>
