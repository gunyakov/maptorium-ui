<script setup lang="ts">
import images from '@/images.json'
</script>
<template>
  <div class="header-btn-box">
    <button
      class="header-btn"
      id="notificationDropdown"
      data-bs-toggle="dropdown"
      aria-expanded="false"
    >
      <i class="fa-light fa-bell"></i>
      <span class="badge bg-danger">9+</span>
    </button>
    <ul class="notification-dropdown dropdown-menu" aria-labelledby="notificationDropdown">
      <li>
        <a href="#" class="d-flex align-items-center">
          <div class="avatar">
            <img :src="images.avatar" alt="image" />
          </div>
          <div class="notification-txt">
            <span class="notification-icon text-primary"
              ><i class="fa-solid fa-thumbs-up"></i
            ></span>
            <span class="fw-bold">Archer</span> Likes your post
          </div>
        </a>
      </li>
      <li>
        <a href="#" class="d-flex align-items-center">
          <div class="avatar">
            <img :src="images.avatar" alt="image" />
          </div>
          <div class="notification-txt">
            <span class="notification-icon text-success"
              ><i class="fa-solid fa-comment-dots"></i
            ></span>
            <span class="fw-bold">Cody</span> Commented on your post
          </div>
        </a>
      </li>
      <li>
        <a href="#" class="d-flex align-items-center">
          <div class="avatar">
            <img :src="images.avatar" alt="image" />
          </div>
          <div class="notification-txt">
            <span class="notification-icon"><i class="fa-solid fa-share"></i></span>
            <span class="fw-bold">Zane</span> Shared your post
          </div>
        </a>
      </li>
      <li>
        <a href="#" class="d-flex align-items-center">
          <div class="avatar">
            <img :src="images.avatar" alt="image" />
          </div>
          <div class="notification-txt">
            <span class="notification-icon text-primary"
              ><i class="fa-solid fa-thumbs-up"></i
            ></span>
            <span class="fw-bold">Christopher</span> Likes your post
          </div>
        </a>
      </li>
      <li>
        <a href="#" class="d-flex align-items-center">
          <div class="avatar">
            <img :src="images.avatar" alt="image" />
          </div>
          <div class="notification-txt">
            <span class="notification-icon text-success"
              ><i class="fa-solid fa-comment-dots"></i
            ></span>
            <span class="fw-bold">Charlie</span> Commented on your post
          </div>
        </a>
      </li>
      <li>
        <a href="#" class="d-flex align-items-center">
          <div class="avatar">
            <img :src="images.avatar" alt="image" />
          </div>
          <div class="notification-txt">
            <span class="notification-icon"><i class="fa-solid fa-share"></i></span>
            <span class="fw-bold">Jayden</span> Shared your post
          </div>
        </a>
      </li>
      <li>
        <a href="#" class="show-all-btn">Show all message</a>
      </li>
    </ul>
  </div>
</template>
