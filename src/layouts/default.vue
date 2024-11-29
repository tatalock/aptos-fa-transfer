<template>
  <header
    class="fixed top-0 left-0 right-0 bg-background/30 shadow-sm backdrop-blur h-20 z-10 flex items-center"
  >
    <Container class="flex justify-between">
      <div class="flex items-center gap-4 font-semibold text-6">Apots FA Transferer</div>
      <ThemeSwitcher />
    </Container>
  </header>
  <router-view></router-view>
</template>

<script lang="ts" setup>
  import Container from '@/lib/Container.vue';
  import ThemeSwitcher from '@/lib/ThemeSwitcher.vue';
</script>

