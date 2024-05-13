<script setup lang="ts">
defineProps<{
  icon?: string
  background?: boolean
}>()
</script>
<template>
  <li class="sidebar-dropdown-item" :class="{ 'btn-primary': background }">
    <a href="#" class="sidebar-link">
      <template v-if="icon">
        <span v-if="icon" class="nav-icon"><i :class="icon"></i></span
        ><span class="sidebar-txt"><slot></slot></span>
      </template>
      <template v-else>
        <slot></slot>
      </template>
    </a>
  </li>
</template>
