<template>
  <div class="card w-full flex-col rounded-md bg-text/5 flex-col p-3 md:p-4" v-bind="$attrs">
    <!-- Title -->
    <div class="text-3xl font-bold leading-loose" v-if="title && !titleSlot">{{ title }}</div>
    <slot name="title"></slot>

    <!-- Content -->
    <slot>
      {{ content }}
    </slot>

    <!-- Bottom -->
    <div class="text-sm" v-if="bottom && !bottomSlot">{{ bottom }}</div>
    <slot name="bottom">
      {{ bottom }}
    </slot>
  </div>
</template>

<script lang="ts" setup>
  withDefaults(defineProps<{ title?: string; content?: string; bottom?: string }>(), {});

  const { title: titleSlot, bottom: bottomSlot } = useSlots();
</script>

<style lang="less" scoped></style>

