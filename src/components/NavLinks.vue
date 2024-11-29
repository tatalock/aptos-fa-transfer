<template>
  <router-link :to="nav.to" v-for="nav in NAV" :key="nav.label">{{ nav.label }}</router-link>
</template>

<script lang="ts" setup>
  const NAV = [
    {
      label: 'Home',
      to: '/',
    },
    {
      label: 'Components',
      to: '/components',
    },
    {
      label: 'Side',
      to: '/side',
    },
  ];
</script>

<style lang="less" scoped></style>

