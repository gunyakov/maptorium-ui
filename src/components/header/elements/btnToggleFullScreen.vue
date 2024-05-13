<script setup lang="ts">
import { ref } from 'vue'
let isFullScreen = ref(false)
//------------------------------------------------------------------------------------------------------------------
// Window Full Screen From Header
//------------------------------------------------------------------------------------------------------------------
function toggleFullScreen() {
  isFullScreen.value = !isFullScreen.value

  const elem = document.documentElement

  if (
    !document.fullscreenElement &&
    !document.mozFullScreenElement &&
    !document.webkitFullscreenElement &&
    !document.msFullscreenElement
  ) {
    if (elem.requestFullscreen) {
      elem.requestFullscreen()
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen()
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen()
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT)
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen()
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen()
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen()
    }
  }
}
</script>
<template>
  <button
    class="header-btn fullscreen-btn"
    :class="isFullScreen ? 'full-screen' : ''"
    @click="toggleFullScreen"
  >
    <i class="fa-light" :class="isFullScreen ? 'fa-compress' : 'fa-expand'"></i>
  </button>
</template>
