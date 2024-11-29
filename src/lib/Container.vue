<template>
  <div :class="containerStyle({ variant })">
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
  import { cva, VariantProps } from 'class-variance-authority';

  const containerStyle = cva('w-full mx-auto', {
    variants: {
      variant: {
        default: 'max-w-1440px px-4 4xl:px-0',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  });
  type containerStyleType = VariantProps<typeof containerStyle>;

  withDefaults(defineProps<{ variant?: containerStyleType['variant'] }>(), {
    variant: 'default',
  });
</script>

<style lang="less" scoped></style>

