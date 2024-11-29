<template>
  <div class="flex-col gap-2">
    <span class="font-semibold" v-if="label">
      {{ label }}:
      <!-- TODO: popover -->
    </span>
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
  defineProps(['label', 'info']);
</script>

