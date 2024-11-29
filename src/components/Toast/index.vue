<template>
  <transition-group name="toast-fade" tag="div" class="tequila-toast-wrapper">
    <div :class="toastVariant({ type: toast.type })" v-for="toast in toasts" :key="toast.id">
      <XIcon
        v-if="toast.closeIcon"
        class="absolute z-999999 right-3 top-14px cursor-pointer w-4 h-4 block group-hover:sm:block sm:top-18px z-2"
        sm="hidden"
        @click="removeToast(toast.id)"
      />
      <div class="flex-col gap-1 flex-1">
        <div class="text-sm font-semibold [&+div]:text-xs" v-if="toast.title">
          {{ toast.title }}
        </div>
        <span class="text-sm">
          {{ toast.content }}
        </span>
      </div>
      <component :is="toast.action" v-if="toast.action" @click="actionClickHandler(toast)" />
    </div>
  </transition-group>
</template>

<script lang="ts" setup>
  import { cva } from 'class-variance-authority';
  import { TequilaToastProps } from '.';
  import XIcon from './x.svg';

  const toastVariant = cva('t-toast-item group', {
    variants: {
      type: {
        default: 'text-black bg-white/80 @dark:text-white @dark:bg-black/80',
        success: 'text-white bg-green-500 @dark:bg-green-600/80',
        error: 'text-white bg-red-500 @dark:bg-red-600/80',
        warning: 'text-white bg-yellow-500 @dark:bg-yellow-600/80',
        info: 'text-white bg-blue-500 @dark:bg-blue-600/80',
      },
    },
    defaultVariants: {
      type: 'default',
    },
  });

  const props = defineProps<{
    toasts: TequilaToastProps[];
  }>();
  const { toasts } = toRefs(props);
  const stopAnimationCheck = ref(false);

  const checkDuration = () => {
    const ts = Date.now();

    for (let i = 0; i < toasts.value.length; i++) {
      const t = toasts.value[i];
      if (!t.duration) continue;
      const startTime = t.id.split('-')[1];
      const duration = ts - Number(startTime);
      if (duration > t.duration) {
        removeToast(t.id);
        break;
      }
    }

    if (!stopAnimationCheck.value) {
      requestAnimationFrame(checkDuration);
    }
  };

  onMounted(() => {
    checkDuration();
  });

  onUnmounted(() => {
    stopAnimationCheck.value = true;
  });

  const actionClickHandler = (toast: TequilaToastProps) => {
    if (toast.actionClose) {
      removeToast(toast.id);
    }
  };

  const removeToast = (id: string) => {
    toasts.value.splice(
      toasts.value.findIndex((t) => t.id === id),
      1,
    );
  };
</script>

<style lang="less" scoped>
  .t-toast-item {
    @apply relative transition-all backdrop-blur;
    @apply p-3;
    @apply sm:p-4 sm:pr-10;
    @apply rounded-md shadow-lg min-w-60;
    @apply flex items-center justify-between gap-2;
    @apply hover:shadow-xl;
  }

  .toast-fade-enter-active,
  .toast-fade-leave-active {
    transition: transform 0.4s cubic-bezier(0.55, 0, 0.1, 1),
      opacity 0.5s cubic-bezier(0.55, 0, 0.1, 1);
  }

  .toast-fade-enter-from,
  .toast-fade-leave-to {
    opacity: 0;
    transform: translate(150%, 0);
  }

  .toast-fade-active {
    position: absolute;
  }
</style>

