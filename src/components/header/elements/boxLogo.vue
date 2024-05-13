<script setup lang="ts">
import Lang from '@/lang'
</script>

<template>
  <div class="col-xxl-6 col-xl-5 col-4 d-flex align-items-center gap-20">
    <div class="main-logo d-lg-block d-none">
      <div class="logo-big">
        <a href="#"> <img v-bind:src="'assets/images/logo-big.png'" alt="Logo" /></a>
      </div>
      <div class="logo-small">
        <a href="#">
          <img v-bind:src="'assets/images/logo-small.png'" alt="Logo" />
        </a>
      </div>
    </div>
    <div class="nav-close-btn">
      <button id="navClose"><i class="fa-light fa-bars-sort"></i></button>
    </div>
    <a href="https://maptorium.net" target="_blank" class="btn btn-sm btn-primary site-view-btn"
      ><i class="fa-light fa-globe me-1"></i> <span>{{ Lang.BTN_VISIT_WEBSITE }}</span></a
    >
  </div>
  <div class="col-4 d-lg-none">
    <div class="mobile-logo">
      <a href="#"> <img v-bind:src="'assets/images/logo-big.png'" alt="Logo" /></a>
    </div>
  </div>
</template>
