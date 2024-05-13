<script setup lang="ts">
import { ref } from 'vue'
import Lang from '@/lang/index'
defineProps<{
  id: string
  icon?: string
}>()
let classShow = ref(false)
function toggleElement() {
  classShow.value = !classShow.value
}
// function() {
//   var dropdownId = $(this).attr('data-dropdown')
//   if (!$('.main-sidebar').hasClass('horizontal-menu two-column-menu')) {
//     if ($('.sidebar-link').hasClass('has-sub')) {
//       $(this).toggleClass('show')
//       $(this).siblings('.sidebar-dropdown-menu').slideToggle(300).parent('.sidebar-item')
//       $(this)
//         .parent('.sidebar-item')
//         .siblings()
//         .find('.sidebar-dropdown-menu')
//         .hide(300)
//         .siblings()
//         .removeClass('show')
//       $(this)
//         .parent('.sidebar-dropdown-item')
//         .siblings()
//         .children('.sidebar-link')
//         .removeClass('show')
//       $(this).parents('.sidebar-item').siblings().find('.sidebar-link').removeClass('show')
//       $(this)
//         .parent('.sidebar-dropdown-item')
//         .siblings()
//         .find('.sidebar-dropdown-menu')
//         .hide(300)
//         .siblings()
//         .removeClass('show')
//       $(this)
//         .parents('.sidebar-item')
//         .siblings()
//         .find('.sidebar-dropdown-menu')
//         .hide(300)
//         .siblings()
//         .removeClass('show')
//     }
//   }
//   if ($('.main-sidebar').hasClass('two-column-menu')) {
//     $(this).addClass('show')
//     $('.main-sidebar').addClass('open-sub').removeClass('sub-menu-collapsed')
//     $('#' + dropdownId)
//       .show()
//       .siblings('.sidebar-dropdown-menu')
//       .hide()
//     $('.header').removeClass('expanded')
//     $('body').removeClass('expanded')
//   }
// }
</script>
<template>
  <li class="sidebar-dropdown-item">
    <a role="button" class="sidebar-link has-sub" :data-dropdown="id"
      ><span v-if="icon" class="nav-icon"><i :class="icon"></i></span
      ><span class="sidebar-txt"><slot></slot></span
    ></a>
    <ul class="sidebar-dropdown-menu" :id="id">
      <slot name="items"
        ><li class="sidebar-dropdown-item">
          <a href="#" class="sidebar-link">{{ Lang.TXT_MENU_EMPTY }}</a>
        </li></slot
      >
    </ul>
  </li>
</template>
