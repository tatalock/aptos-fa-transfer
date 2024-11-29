<template>
  <Card :class="statsPanelVariant({ vertical })" v-bind="$attrs">
    <!-- Title -->
    <template #title>
      <span class="text-sm text-text/30" v-if="title && !titleSlot">{{ title }}</span>
      <slot name="title"></slot>
    </template>
    <!--  Value -->
    <span class="text-5 font-semibold" v-if="content && !contentSlot">
      {{ content }}
    </span>
    <slot name="content"></slot>
  </Card>
</template>

<script lang="ts" setup>
  import { cva, VariantProps } from 'class-variance-authority';
  import Card from './Card.vue';

  const statsPanelVariant = cva('flex-col gap-2', {
    variants: {
      vertical: {
        left: 'items-start',
        right: 'items-end',
        center: 'items-center',
      },
    },
  });

  type StatsPanelVariantType = VariantProps<typeof statsPanelVariant>;

  defineProps<{
    title: string;
    content: string;
    vertical?: StatsPanelVariantType['vertical'];
  }>();

  const { title: titleSlot, content: contentSlot } = useSlots();
</script>

<style lang="less" scoped></style>

