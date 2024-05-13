<script setup lang="ts">
import Lang, { setLang } from '@/lang/index'
import API from '@/API/index'
function changeLanguage(lang: string) {
  setLang(lang)
  API.SetLang(lang)
}
</script>
<template>
  <div class="lang-select">
    <div class="input-group">
      <button
        class="btn btn-primary dropdown-toggle"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        {{ Lang.TXT_UNITS }}
      </button>
      <ul class="dropdown-menu">
        <li>
          <a class="dropdown-item" href="#" @click="API.GPS.setUnits('mile')">{{
            Lang.TXT_MILE
          }}</a>
        </li>
        <li>
          <a class="dropdown-item" href="#" @click="API.GPS.setUnits('nmile')">{{
            Lang.TXT_NMILE
          }}</a>
        </li>
        <li>
          <a class="dropdown-item" href="#" @click="API.GPS.setUnits('foot')">{{
            Lang.TXT_FOOT
          }}</a>
        </li>
        <li>
          <a class="dropdown-item" href="#" @click="API.GPS.setUnits('yard')">{{
            Lang.TXT_YARD
          }}</a>
        </li>
        <li><hr class="dropdown-divider" /></li>
        <li>
          <a class="dropdown-item" href="#" @click="API.GPS.setUnits('meter')">{{
            Lang.TXT_METER
          }}</a>
        </li>
        <li>
          <a class="dropdown-item" href="#" @click="API.GPS.setUnits('kilometer')">{{
            Lang.TXT_KILOMETER
          }}</a>
        </li>
      </ul>
      <button
        class="btn btn-primary dropdown-toggle"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        {{ Lang.TXT_LANGUAGE }}
      </button>
      <ul class="dropdown-menu">
        <li><a class="dropdown-item" href="#" @click="changeLanguage('en')">EN</a></li>
        <li><a class="dropdown-item" href="#" @click="changeLanguage('ru')">RU</a></li>
      </ul>
    </div>
  </div>
</template>
