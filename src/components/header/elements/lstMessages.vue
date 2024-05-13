<script setup lang="ts">
import API from '@/API'
import Lang from '@/lang'
</script>
<template>
  <div class="header-btn-box">
    <button class="header-btn" id="messageDropdown" data-bs-toggle="dropdown" aria-expanded="false">
      <i class="fa-light fa-comment-dots"></i>
      <span v-if="API.logList.value.length > 0" class="badge bg-danger">{{
        API.logList.value.length
      }}</span>
    </button>
    <ul class="message-dropdown dropdown-menu" aria-labelledby="messageDropdown">
      <template v-for="(item, key) in API.logList.value" :key="key">
        <li>
          <a href="#" class="d-flex">
            <div class="msg-txt">
              <span class="name">{{ item.module }}</span>
              <span class="msg-short">{{ item.message }}</span>
              <span class="time">{{ item.formatedTime }}</span>
            </div>
          </a>
        </li>
      </template>
      <li>
        <a href="#" class="show-all-btn" @click="API.cleanLog()">{{ Lang.BTN_CLEAN_LOG }}</a>
      </li>
    </ul>
  </div>
</template>
