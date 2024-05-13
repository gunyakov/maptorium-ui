<script setup lang="ts">
defineProps<{
  id: string
  active?: boolean
}>()
</script>
<template>
  <li class="nav-item">
    <a
      class="btn btn-sm btn-outline-primary"
      :class="{ active: active }"
      data-bs-toggle="tab"
      :href="id"
      role="tab"
    >
      <slot></slot>
    </a>
  </li>
</template>
