<template>
  <div
    class="notify"
    :class="{
      '!opacity-100 !top-4': show,
      '!bg-success': snackbar.type === 'success',
      '!bg-error': snackbar.type === 'error',
      '!bg-gray': snackbar.type === 'warning',
    }"
  >
    <span class="break-all">
      {{ snackbar.text }}
    </span>
    <span class="cursor-pointer text-black" @click="closeHandler" v-if="!timeout">CLOSE</span>
  </div>
</template>

<script lang="ts" setup>
  const snackbar = withDefaults(
    defineProps<{
      show: boolean;
      text: string;
      type?: 'success' | 'error' | 'warning' | 'info';
      timeout?: number;
      close?: () => void;
    }>(),
    {
      type: 'info',
      timeout: 3000,
    },
  );

  const show = ref(false);
  const emits = defineEmits(['close']);
  const closeID: any = ref(null);

  const closeHandler = () => {
    show.value = false;

    if (closeID.value) {
      clearTimeout(closeID.value);
      closeID.value = null;
    }

    setTimeout(() => {
      emits('close');
    }, 300);
  };

  onMounted(() => {
    setTimeout(() => {
      show.value = true;
    }, 200);

    if (snackbar.timeout) {
      closeID.value = setTimeout(() => {
        closeHandler();
      }, snackbar.timeout);
    }
  });
</script>

<style lang="less">
  .notify {
    @apply z-100000 fixed fixed -top-20 left-1/2 -translate-x-1/2;
    @apply transition-all duration-200;
    @apply bg-white font-medium opacity-0 p-4 py-2 rounded-md mx-auto;
    @apply text-sm text-white w-fit max-w-200 shadow shadow-md shadow-black/10;
    @apply border-1 border-solid border-black/2;
    @apply flex items-center gap-4 justify-between;
  }
</style>

