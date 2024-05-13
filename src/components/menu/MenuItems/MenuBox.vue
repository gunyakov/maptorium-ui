<script setup lang="ts">
import Lang from '@/lang/index'
defineProps<{
  icon?: string
}>()
</script>
<template>
  <li class="sidebar-item">
    <a role="button" class="sidebar-link-group-title has-sub"
      ><i v-if="icon" :class="icon"></i> <slot></slot
    ></a>
    <ul class="sidebar-link-group" style="display: none">
      <slot name="items"
        ><li class="sidebar-dropdown-item">
          <a href="#" class="sidebar-link"
            ><span class="sidebar-txt">{{ Lang.TXT_MENU_EMPTY }}</span></a
          >
        </li></slot
      >
    </ul>
  </li>
</template>
