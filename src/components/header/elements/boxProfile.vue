<script setup lang="ts">
import images from '@/images.json'
</script>
<template>
  <div class="header-btn-box profile-btn-box">
    <button class="profile-btn" data-bs-toggle="dropdown" aria-expanded="false">
      <img :src="images.admin" alt="image" />
    </button>
    <ul class="dropdown-menu profile-dropdown-menu">
      <li>
        <div class="dropdown-txt text-center">
          <p class="mb-0">Shaikh Abu Dardah</p>
          <span class="d-block">Web Developer</span>
          <div class="d-flex justify-content-center">
            <div class="form-check pt-3">
              <input class="form-check-input" type="checkbox" id="seeProfileAsSidebar" />
              <label class="form-check-label" for="seeProfileAsSidebar">See as sidebar</label>
            </div>
          </div>
        </div>
      </li>
      <li>
        <a class="dropdown-item" href="view-profile.html"
          ><span class="dropdown-icon"><i class="fa-regular fa-circle-user"></i></span> Profile</a
        >
      </li>
      <li>
        <a class="dropdown-item" href="chat.html"
          ><span class="dropdown-icon"><i class="fa-regular fa-message-lines"></i></span> Message</a
        >
      </li>
      <li>
        <a class="dropdown-item" href="task.html"
          ><span class="dropdown-icon"><i class="fa-regular fa-calendar-check"></i></span>
          Taskboard</a
        >
      </li>
      <li>
        <a class="dropdown-item" href="#"
          ><span class="dropdown-icon"><i class="fa-regular fa-circle-question"></i></span> Help</a
        >
      </li>
      <li><hr class="dropdown-divider" /></li>
      <li>
        <a class="dropdown-item" href="edit-profile.html"
          ><span class="dropdown-icon"><i class="fa-regular fa-gear"></i></span> Settings</a
        >
      </li>
      <li>
        <a class="dropdown-item" href="login.html"
          ><span class="dropdown-icon"><i class="fa-regular fa-arrow-right-from-bracket"></i></span>
          Logout</a
        >
      </li>
    </ul>
  </div>
</template>
