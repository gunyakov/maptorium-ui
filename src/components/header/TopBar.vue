<script setup lang="ts">
import boxLogo from './elements/boxLogo.vue'

import boxSearch from './elements/boxSearch.vue'
import boxLanguage from './elements/boxLanguage.vue'

import btnToggleFullScreen from './elements/btnToggleFullScreen.vue'
import Calc from './elements/calc.vue'
import lstNotifications from './elements/lstNotifications.vue'
import lstMessages from './elements/lstMessages.vue'
import boxProfile from './elements/boxProfile.vue'
import btnHeaderCollapse from './elements/btnHeaderCollapse.vue'
import btnTheme from './elements/btnTheme.vue'

function showSideBar() {
  document.querySelector('.right-sidebar')?.classList.add('active')
}
</script>
<template>
  <!-- header start -->
  <div class="header">
    <div class="row g-0 align-items-center">
      <boxLogo />
      <div class="col-xxl-6 col-xl-7 col-lg-8 col-4">
        <div class="header-right-btns d-flex justify-content-end align-items-center">
          <div class="header-collapse-group">
            <div class="header-right-btns d-flex justify-content-end align-items-center p-0">
              <boxSearch />
              <boxLanguage />
              <div class="header-right-btns d-flex justify-content-end align-items-center p-0">
                <lstMessages />
                <!--<lstNotifications />-->
                <Calc />
                <btnToggleFullScreen />

                <button class="header-btn theme-settings-btn" @click="showSideBar">
                  <i class="fa-light fa-gear"></i>
                </button>
              </div>
            </div>
          </div>
          <btnHeaderCollapse />
          <btnTheme />
          <!--<boxProfile />-->
        </div>
      </div>
    </div>
  </div>
  <!-- header end -->
</template>
