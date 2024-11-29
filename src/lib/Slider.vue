<template>
  <div class="w-full h-2 rounded-md bg-text/10 relative">
    <div class="text-xs left-0 bottom-3 absolute">{{ min }}{{ unit }}</div>
    <div class="text-xs right-0 bottom-3 absolute">{{ max }}{{ unit }}</div>
    <div
      class="h-full bg-text rounded-md transition-all"
      :style="{
        width: `${((value - min) / (max - min)) * 100}%`,
      }"
    ></div>
    <div
      class="absolute top-0 left-0 -translate-x-1 -translate-y-1 w-4 h-4 rounded-full bg-white border border-solid border-black/30 hover:bg-primary hover:border-black/10 hover:shadow-lg active:scale-95 transition-all shadow-md cursor-pointer"
      :style="{
        left: `${((value - min) / (max - min)) * 100}%`,
      }"
      @mousedown="onMouseDown"
    ></div>
    <input
      v-model="value"
      type="range"
      :min="min"
      :max="max"
      :step="step"
      class="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
      @input="onInput"
    />
  </div>
</template>

<script lang="ts" setup>
  const props = withDefaults(
    defineProps<{
      modelValue: number;
      max: number;
      min: number;
      step: number;
      unit?: string;
    }>(),
    {
      modelValue: 0,
      unit: '',
    },
  );

  const emits = defineEmits(['update:modelValue']);
  const value = ref(props.modelValue);

  watch(
    () => props.modelValue,
    () => {
      value.value = props.modelValue;
    },
    { immediate: true },
  );

  const onInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const newValue = parseFloat(target.value);
    value.value = newValue;
    emits('update:modelValue', newValue);
  };

  const onMouseDown = (event: MouseEvent) => {
    const { x } = useMouse();
    const sliderRect = (event.target as HTMLElement).parentElement!.getBoundingClientRect();

    const moveHandler = () => {
      const currentX = x.value - sliderRect.left;
      const currentValue = (currentX / sliderRect.width) * (props.max - props.min) + props.min;
      value.value = Math.round(currentValue / props.step) * props.step;
      value.value = Math.max(0, Math.min(100, value.value));
      emits('update:modelValue', value.value);
    };

    const upHandler = () => {
      document.removeEventListener('mousemove', moveHandler);
      document.removeEventListener('mouseup', upHandler);
    };

    document.addEventListener('mousemove', moveHandler);
    document.addEventListener('mouseup', upHandler);
  };
</script>

<style lang="less" scoped></style>

