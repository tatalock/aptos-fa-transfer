<template>
  <Teleport to="body">
    <div
      class="fixed top-100000 left-0 right-0 bottom-0 z-1000 bg-black/40 flex-col-center"
      :class="{
        '!top-0': props.visible,
      }"
      @click="emits('update:visible', false)"
    >
      <div
        class="bg-background rounded-4 p-4 translate-y-40 transition-all max-w-full max-h-80vh overflow-y-auto"
        :class="{
          '!translate-y-0': props.visible,
        }"
        :style="{
          width: props.width,
        }"
      >
        <slot />
      </div>
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
  const props = withDefaults(
    defineProps<{
      visible?: boolean;
      width?: string;
    }>(),
    {
      visible: false,
      width: '520px',
    },
  );
  const emits = defineEmits(['update:visible']);
</script>

<style lang="less" scoped></style>

