<template>
  <div class="w-20 min-h-screen overflow-y-auto transition-all p-2 flex-col gap-4" md="w-55">
    <img src="https://placehold.co/200x40" class="rounded-sm" />
    <div class="flex-col gap-2">
      <NavLinks />
      <ThemeSwitcher />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import ThemeSwitcher from '@/lib/ThemeSwitcher.vue';
</script>

<style lang="less" scoped></style>

