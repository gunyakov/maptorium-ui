<script setup lang="ts">
import MainMenu from './MenuItems/MainMenu.vue'
import BaseMaps from './BaseMaps.vue'
import LayerMaps from './LayerMaps.vue'
import MenuGPS from './MenuGPS.vue'
import MenuNetwork from './MenuNetwork.vue'
import MenuDraw from './MenuDraw.vue'
import MenuPanes from './MenuPanes.vue'
import MenuView from './MenuView.vue'
</script>

<template>
  <MainMenu>
    <BaseMaps />
    <LayerMaps />
    <MenuNetwork />
    <MenuPanes />
    <MenuDraw />
    <MenuView />
    <MenuGPS />
  </MainMenu>
</template>
