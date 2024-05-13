<script setup lang="ts">
import Lang from '@/lang/index'
import API from '@/API/index'

import Item from '@/components/elements/POIManager/Item.vue'
import ItemSub from '@/components/elements/POIManager/ItemSub.vue'
import { ManagerItemType } from '@/enum'
</script>
<template>
  <div class="sidebar flex-center left" :class="{ collapsed: !API.POI.show.value }">
    <div class="sidebar-content rounded-rect flex-center">
      <div class="treeview-animated w-20 treeview">
        <h3 class="pt-3 ps-3">
          {{ Lang.TXT_POI_LIST }}
          <i
            class="float-end me-3 cursor-pointer text-success bx bx-folder-plus"
            @click="API.POI.CategoryAdd()"
          ></i>
        </h3>

        <hr />
        <ul class="treeview-animated-list mb-3">
          <template v-for="(item, index) in API.POI.managerList.value" :key="index">
            <Item
              v-if="item.type == ManagerItemType.item"
              icon="far fa-comment"
              @edit="API.POI.Update(item.ID)"
              @remove="API.POI.Delete(item.ID)"
              >{{ item.name }}</Item
            >
            <ItemSub
              v-if="item.type == ManagerItemType.folder"
              :items="item.items"
              :id="item.ID"
              @add="(parentID: number) => API.POI.CategoryAdd(parentID)"
              @remove="(ID: number) => API.POI.CategoryDelete(ID)"
              @edit="(ID: number) => API.POI.CategoryEdit(ID)"
            >
              {{ item.name }}
            </ItemSub>
          </template>
        </ul>
      </div>
    </div>
  </div>
</template>
<style>
.rounded-rect {
  background: white;
  border-radius: 10px;
  box-shadow: 0 0 50px -25px black;
}

.flex-center {
  top: 7px;
  position: absolute;
}

.flex-center.left {
  left: 15px;
}

.sidebar-content {
  position: absolute;
  height: 95%;
  background-color: rgba(7, 23, 57, 0.8);
  color: #c8d4f0;
  overflow-x: auto;
  backdrop-filter: blur(3px);
}

.dark-theme .sidebar-content {
  background-color: rgba(24, 25, 26, 0.8);
  color: #a9b4cc;
}

.light-theme .sidebar-content {
  background-color: rgba(245, 245, 245, 0.8);
  color: #464646;
}

.sidebar {
  transition: transform 1s;
  z-index: 1;
  width: 300px;
  height: 100%;
}

/*
  The sidebar styling has them "expanded" by default, we use CSS transforms to push them offscreen
  The toggleSidebar() function removes this class from the element in order to expand it.
*/
.left.collapsed {
  transform: translateX(-500px);
}

.treeview.w-20 {
  width: 20rem;
}
.treeview .rotate {
  margin-top: 0.2rem;
  font-size: 0.8rem;
  vertical-align: text-top;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-transition: all 0.1s linear;
  transition: all 0.1s linear;
}
.treeview .rotate.down {
  -webkit-transform: rotate(90deg);
  transform: rotate(90deg);
}
.treeview .nested {
  display: none;
}
.treeview .active {
  display: block;
}
.treeview ul {
  list-style-type: none;
}
.treeview a {
  text-decoration: none;
}
.treeview .ic-w {
  width: 1.3rem;
}
.treeview-animated.w-20 {
  width: 20rem;
}
.treeview-animated ul {
  position: relative;
  list-style: none;
}
.treeview-animated .treeview-animated-list li {
  padding: 0.1em 0.2em 0.1em 0.7em;
}
.treeview-animated .treeview-animated-list .treeview-animated-items .nested::before {
  position: absolute;
  left: 5px;
  display: block;
  width: 5px;
  height: 100%;
  content: '';
  background-color: gray;
}
.treeview-animated .treeview-animated-list .treeview-animated-items .closed {
  display: block;
  padding: 0.2em 0.2em 0.2em 0.4em;
  margin-right: 0;
  border-top-left-radius: 0.3em;
  border-bottom-left-radius: 0.3em;
  text-decoration: none;
}
.treeview-animated .treeview-animated-list .treeview-animated-items .closed:hover {
  background-color: #8cb9ff;
}
.treeview-animated .treeview-animated-list .treeview-animated-items .closed .fa-angle-right {
  font-size: 0.1rem;
  -webkit-transition: all 0.1s linear;
  transition: all 0.1s linear;
}
.treeview-animated .treeview-animated-list .treeview-animated-items .closed .fa-angle-right.down {
  position: relative;
  color: #f8f9fa;
  -webkit-transform: rotate(90deg);
  transform: rotate(90deg);
}
.treeview-animated .treeview-animated-list .treeview-animated-items .open {
  background-color: #32a0ff;
  -webkit-transition: all 0.1s linear;
  transition: all 0.1s linear;
}
.treeview-animated .treeview-animated-list .treeview-animated-items .open:hover {
  color: #f8f9fa;
  background-color: #32a0ff;
}
.treeview-animated .treeview-animated-list .treeview-animated-items .open span {
  color: #f8f9fa;
}
.treeview-animated .treeview-animated-list .treeview-animated-element {
  padding: 0.2em 0.2em 0.2em 0.6em;
  cursor: pointer;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  -webkit-transition: all 0.1s linear;
  transition: all 0.1s linear;
}
.treeview-animated .treeview-animated-list .treeview-animated-element:hover {
  background-color: #8cb9ff;
}
.treeview-animated .treeview-animated-list .treeview-animated-element.opened {
  color: #f8f9fa;
  background-color: #32a0ff;
}
.treeview-animated .treeview-animated-list .treeview-animated-element.opened:hover {
  color: #f8f9fa;
  background-color: #32a0ff;
}
.treeview-colorful {
  font-size: 16px;
  font-weight: 400;
  background: rgba(224, 127, 178, 0.2);
}
.treeview-colorful.w-20 {
  width: 20rem;
}
.treeview-colorful hr {
  border-color: #a2127a;
}
.treeview-colorful h6 {
  font-size: 1.4em;
  font-weight: 500;
  color: #a2127a;
}
.treeview-colorful ul {
  position: relative;
  padding-left: 0;
  list-style: none;
}
.treeview-colorful .treeview-colorful-list ul {
  padding-left: 1em;
  margin-top: 0.1em;
  background: rgba(224, 127, 178, 0.2);
}
.treeview-colorful .treeview-colorful-element {
  padding: 0.2em 0.2em 0.2em 1em;
  cursor: pointer;
  border: 2px solid transparent;
  border-right: 0 solid transparent;
  -webkit-transition: all 0.1s linear;
  transition: all 0.1s linear;
}
.treeview-colorful .treeview-colorful-element:hover {
  background-color: #e07fb2;
}
.treeview-colorful .treeview-colorful-element.opened {
  color: #ffac47;
  background-color: #a2127a;
  border: 2px solid #ffac47;
  border-right: 0 solid transparent;
}
.treeview-colorful .treeview-colorful-element.opened:hover {
  color: #ffac47;
  background-color: #a2127a;
}
.treeview-colorful .treeview-colorful-items-header {
  display: block;
  padding: 0.4em;
  margin-right: 0;
  border-bottom: 2px solid transparent;
  -webkit-transition: all 0.1s linear;
  transition: all 0.1s linear;
  text-decoration: none;
}
.treeview-colorful .treeview-colorful-items-header:hover {
  background-color: #e07fb2;
}
.treeview-colorful .treeview-colorful-items-header.open {
  background-color: #a2127a;
  border-bottom: 2px solid #ffac47;
  -webkit-transition: all 0.1s linear;
  transition: all 0.1s linear;
}
.treeview-colorful .treeview-colorful-items-header.open span {
  color: #ffac47;
}
.treeview-colorful .treeview-colorful-items-header.open:hover {
  color: #ffac47;
  background-color: #a2127a;
}
.treeview-colorful .treeview-colorful-items-header.open div:hover {
  background-color: #a2127a;
}
.treeview-colorful .treeview-colorful-items-header .fa-angle-right {
  font-size: 0.8rem;
  -webkit-transition: all 0.2s linear;
  transition: all 0.2s linear;
}
.treeview-colorful .treeview-colorful-items-header .fas {
  position: relative;
  color: #ffac47;
  -webkit-transition: all 0.2s linear;
  transition: all 0.2s linear;
  -webkit-transform: rotate(90deg);
  transform: rotate(90deg);
}
.treeview-colorful .treeview-colorful-items-header .fa-minus-circle {
  position: relative;
  color: #ffac47;
  -webkit-transition: all 0.2s linear;
  transition: all 0.2s linear;
  -webkit-transform: rotate(180deg);
  transform: rotate(180deg);
}
.cursor-pointer {
  cursor: pointer;
}
</style>
