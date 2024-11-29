<template>
  <div class="w-full min-h-screen grid grid-cols-[auto_minmax(0,1fr)] gap-3">
    <SideBar />
    <router-view></router-view>
  </div>
</template>

<script lang="ts" setup>
  import SideBar from '@/components/SideBar.vue';
</script>

<style lang="less" scoped></style>

