<template>
  <div class="d-flex" style="font-size: small">
    <strong class="d-inline-block ms-4"><slot></slot></strong>
    <div class="d-inline-block">
      <slot name="body"></slot>
    </div>
  </div>
</template>
