<script setup lang="ts">
//import { RouterLink, RouterView } from 'vue-router'
import TopBar from '@/components/header/TopBar.vue'
import LayoutSettings from '@/components/LayoutSettings.vue'
import MainMenu from '@/components/menu/MainMenu.vue'
import MainContent from '@/components/MainContent.vue'
import ModalZoom from '@/components/modals/ModalZoom.vue'
import ModalOffset from '@/components/modals/ModalOffset.vue'
import ModalDownload from '@/components/modals/ModalDownload.vue'
import ModalPOIAdd from '@/components/modals/POIAdd.vue'
import DrawerPanel from '@/components/DrawerPanel.vue'
import Modals from '@/components/Modals.vue'
</script>
<template>
  <!-- preloader start -->
  <div class="preloader d-none">
    <div class="loader">
      <span></span>
      <span></span>
      <span></span>
    </div>
  </div>
  <!-- preloader end -->
  <!-- Begin page -->
  <div id="layout-wrapper">
    <TopBar />
    <LayoutSettings />
    <MainMenu />
    <MainContent />
  </div>
  <ModalZoom />
  <ModalOffset />
  <ModalDownload />
  <ModalPOIAdd />
  <DrawerPanel />
  <Modals />
  <!-- End page -->
</template>
