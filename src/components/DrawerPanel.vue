<script setup lang="ts">
import { ref } from 'vue'
import DrawerPanel from '@/API/DrawerPanel'
const left = ref(300)
const top = ref(200)
let panelMove = false
function movePanel(e: MouseEvent) {
  if (panelMove) {
    left.value = e.clientX - 20
    top.value = e.clientY - 20
  }
}
</script>
<template>
  <!--Drawer panel-->
  <div
    class="drawer-panel"
    :style="{
      left: `${left}px`,
      top: `${top}px`,
      display: DrawerPanel.visible.value ? 'block' : 'none'
    }"
  >
    <button
      type="button"
      class="btn btn-primary"
      data-bs-toggle="tooltip"
      data-bs-placement="top"
      title="Move panel"
      data-bs-original-title="Move Panel"
      @mousedown="panelMove = true"
      @mouseup="panelMove = false"
      @mouseout="panelMove = false"
      @mousemove="movePanel"
    >
      <i class="mdi mdi-cursor-move"></i>
    </button>
    <div class="btn-group mt-4 mt-md-0" role="group">
      <button
        type="button"
        class="btn btn-primary"
        data-bs-toggle="tooltip"
        data-bs-placement="top"
        title="Save"
        data-bs-original-title="Save"
        @click="DrawerPanel.save"
      >
        <i class="mdi mdi-content-save-outline"></i>
      </button>
      <button
        type="button"
        class="btn btn-primary"
        data-bs-toggle="tooltip"
        data-bs-placement="top"
        title="Cancel"
        data-bs-original-title="Cancel"
        @click="DrawerPanel.hide"
      >
        <i class="mdi mdi-cancel"></i>
      </button>
    </div>
  </div>
  <!--/Drawer panel-->
</template>
<style>
.drawer-panel {
  z-index: 2000;
  position: absolute;
  background-color: rgba(7, 23, 57, 0.7);
  color: #c8d4f0;
  backdrop-filter: blur(3px);
}

.dark-theme .drawer-panel {
  background-color: rgba(24, 25, 26, 0.7);
  color: #a9b4cc;
}

.light-theme .drawer-panel {
  background-color: rgba(245, 245, 245, 0.7);
  color: #464646;
}
</style>
