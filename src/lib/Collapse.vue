<template>
  <div class="flex-col">
    <div class="text-sm flex items-center gap-1 cursor-pointer" @click="expand = !expand">
      <slot name="title"></slot>
      <ChevronDown
        :size="14"
        class="transition-all"
        :class="{
          'rotate-180': expand,
        }"
      />
    </div>
    <div class="flex-col mt-2 gap-1" v-show="expand">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ChevronDown } from 'lucide-vue-next';
  const props = defineProps<{
    expand?: boolean;
  }>();

  const expand = ref(props.expand || false);
</script>

<style lang="less" scoped></style>

