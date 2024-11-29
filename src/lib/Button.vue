<template>
  <button
    :class="
      button({
        variant,
        size,
        type,
        round,
        loading,
        disabled,
      })
    "
    @click="
      (evt:any) => {
        if (loading || disabled) {
          evt.preventDefault();
          evt.stopPropagation();
        }else{
          emits('click', evt);
        }
      }
    "
  >
    <div
      class="w-full h-full bg-gray/20 absolute z-1 top-0 left-0 flex-center pointer-event-none opacity-0 transition-all duration-400"
      :class="{
        'opacity-100': loading,
      }"
      v-if="loading"
    >
      <LoaderCircle :size="24" class="animate-spin" color="white" />
    </div>
    <div
      class="flex-center gap-2 transition-all"
      :class="{
        'opacity-0': loading,
        '!flex-col-center py-3': iconVertical,
      }"
    >
      <component :is="prefixIcon" :size="prefixIconSize" v-if="prefixIcon"></component>
      <slot></slot>
      <component :is="suffixIcon" :size="suffixIconSize" v-if="suffixIcon"></component>
    </div>
  </button>
</template>

<script lang="ts" setup>
  import { cva, VariantProps } from 'class-variance-authority';
  import { LoaderCircle } from 'lucide-vue-next';
  import { FunctionalComponent } from 'vue';

  const button = cva('btn', {
    variants: {
      variant: {
        default: 'btn-default',
        secondary: 'bg-secondary',
        inverted: 'bg-inverted',
        outline: 'border-1 border-solid !border-[currentColor] !bg-transparent',
        text: 'border-transparent bg-transparent text-btnText',
      },
      type: {
        primary: '',
        info: 'btn-info',
        warning: 'btn-warning',
        success: 'btn-success',
        error: 'btn-error',
      },
      size: {
        xs: 'btn-xs',
        sm: 'btn-sm',
        md: 'btn-md',
        lg: 'btn-lg',
      },
      loading: {
        true: 'btn-loading',
      },
      disabled: {
        true: 'btn-disabled',
      },
      round: {
        true: 'btn-rounded',
      },
    },
    compoundVariants: [
      {
        variant: 'outline',
        type: 'primary',
        class: '!text-primary',
      },
      {
        variant: 'outline',
        type: 'info',
        class: '!text-info',
      },
      {
        variant: 'outline',
        type: 'warning',
        class: '!text-warning',
      },
      {
        variant: 'outline',
        type: 'error',
        class: '!text-error',
      },
      {
        variant: 'outline',
        type: 'success',
        class: '!text-success',
      },
    ],
    defaultVariants: {
      variant: 'default',
      type: 'primary',
      size: 'sm',
    },
  });
  type buttonProps = VariantProps<typeof button>;

  withDefaults(
    defineProps<{
      prefixIcon?: FunctionalComponent;
      prefixIconSize?: number;
      suffixIcon?: FunctionalComponent;
      suffixIconSize?: number;

      iconVertical?: boolean;

      variant?: buttonProps['variant'];
      size?: buttonProps['size'];
      type?: buttonProps['type'];
      round?: buttonProps['round'];
      loading?: buttonProps['loading'];
      disabled?: buttonProps['disabled'];
    }>(),
    {
      variant: 'default',
      size: 'md',
      iconVertical: false,
      prefixIconSize: 18,
      suffixIconSize: 18,
    },
  );
  const emits = defineEmits(['click']);
</script>

<style lang="less" scoped>
  .btn-outline-base {
    @apply bg-transparent;
    border-color: currentColor;
  }

  .btn {
    @apply cursor-pointer hover:opacity-90 transition-all;
    @apply rounded-md relative font-medium text-18px;
    @apply overflow-hidden;
    @apply px-4 min-h-14;
    @apply active:scale-95;

    &.btn-outline {
      @apply text-btn-background;
      .btn-outline-base;
    }
  }

  .btn-default {
    @apply bg-btn-background text-btn-text;
  }

  .btn-secondary {
    @apply bg-secondary border-transparent;

    &.btn-outline {
      @apply text-secondary;
      .btn-outline-base;
    }
  }

  .btn-inverted {
    @apply bg-inverted border-transparent;

    &.btn-outline {
      .btn-outline-base;
      @apply text-inverted;
    }
  }

  // size
  .btn-xs {
    @apply px-3 text-xs min-h-6;
  }

  .btn-sm {
    @apply px-4 text-sm min-h-8;
  }

  .btn-md {
    @apply px-5 text-base min-h-10;
  }

  .btn-lg {
    @apply px-6 text-lg min-h-16;
  }

  .btn,
  .btn-lg,
  .btn-sm,
  .btn-xs {
    @apply !leading-[1];
  }

  .btn-round {
    @apply rounded-full aspect-1 p-0;
  }

  .btn-loading {
    @apply cursor-wait;
    @apply active:scale-100;
  }

  .btn-disabled {
    @apply grayscale cursor-not-allowed;
    @apply active:scale-100;
  }
</style>

