<template>
  <div
    class="flex items-center cursor-pointer w-fit rounded-10 bg-background p-2px py-2px transition-theme"
    :class="{ 'is-light': theme === 'light', 'is-dark': theme === 'dark' }"
  >
    <span class="switcher-btn" :class="{ 'active-light': theme === 'light' }">
      <Sun @click="setLightTheme" :size="20" />
    </span>
    <span class="switcher-btn" :class="{ active: theme === 'dark' }">
      <Moon @click="setDarkTheme" :size="20" />
    </span>
  </div>
</template>

<script lang="ts" setup>
  import { Moon, Sun } from 'lucide-vue-next';

  withDefaults(
    defineProps<{
      store?: boolean;
    }>(),
    {
      store: true,
    },
  );
  type ThemeType = 'light' | 'dark';
  const themeLocalStore = useStorage<ThemeType>('theme', 'light');

  const theme = defineModel<ThemeType>('theme', { default: 'light' });

  const setLightTheme = () => {
    theme.value = 'light';
    themeLocalStore.value = 'light';
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
  };

  const setDarkTheme = () => {
    theme.value = 'dark';
    themeLocalStore.value = 'dark';
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
  };

  onMounted(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    prefersDark.addEventListener('change', (e) => {
      if (e.matches) {
        setDarkTheme();
      } else {
        setLightTheme();
      }
    });

    if (prefersDark.matches) {
      setDarkTheme();
    } else {
      setLightTheme();
    }
  });
</script>

<style lang="less" scoped>
  .transition-theme {
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  .is-light {
    background-color: #ffffff;
    color: #000000;
  }

  .is-dark {
    background-color: #1a1a1a;
    color: #ffffff;
  }

  .switcher-btn {
    @apply p-1 rounded-full text-gray;

    &.active-light,
    &.active {
      @apply bg-green-500 text-black;
    }

    &.active-light {
      @apply bg-yellow-300 text-black;
    }
  }
</style>

