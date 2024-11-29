<template>
  <div
    :class="[
      inputWrapperStyle({
        variant,
        size,
        rounded,
        disabled,
      }),
      {
        'grid-cols-[auto_1fr]': prefixExist && !suffixExist,
        'grid-cols-[auto_1fr_auto]': prefixExist && suffixExist,
        'grid-cols-[1fr_auto]': !prefixExist && suffixExist,
      },
    ]"
  >
    <span class="prefix" v-if="prefixExist">
      <slot name="prefix">
        <component :is="prefixIcon" class="w-4 h-4" v-if="prefixIcon" />
        <template v-else>
          {{ prefix }}
        </template>
      </slot>
    </span>
    <div class="grid grid-cols-[1fr_auto] items-center gap-1">
      <input
        :class="[inputStyle({ disabled })]"
        :disabled="disabled"
        v-model.trim="value"
        v-bind="$attrs"
        autocomplete="off"
        autocorrect="off"
        spellcheck="false"
        @input="inputHandler"
      />
      <span class="clear-icon" @click="clearHandler" v-if="clearable && value">
        <CircleX :size="16" />
      </span>
    </div>
    <span class="suffix" v-if="suffixExist">
      <slot name="suffix">
        <component :is="suffixIcon" class="w-4 h-4" v-if="suffixIcon" />
        <template v-else>
          {{ suffix }}
        </template>
      </slot>
    </span>
  </div>
</template>

<script lang="ts">
  export const PATTERN = {
    number: (precision: number) =>
      precision == 0 || !precision
        ? `^\-?([0-9]+)?`
        : `^\-?([0-9]+)?([,\.])?([0-9]{0,${precision}})?`,
  };
</script>

<script lang="ts" setup>
  import { cva, VariantProps } from 'class-variance-authority';
  import { CircleX } from 'lucide-vue-next';
  import { FunctionalComponent } from 'vue';

  // Styles
  const inputWrapperStyle = cva(
    'p-2 grid items-center gap-1 overflow-x-hidden transition-all border border-solid border-transparent',
    {
      variants: {
        variant: {
          default: 'bg-text/10',
          empty: '',
          outline: 'focus-within:border-text',
          'outline-filled': 'focus-within:border-text focus-within:bg-text/10',
        },
        size: {
          sm: 'text-sm',
          md: 'text-md',
          base: 'text-base',
          lg: 'text-7',
        },
        rounded: {
          true: 'rounded-md',
          false: 'rounded-0',
        },
        disabled: {
          true: 'bg-background cursor-not-allowed',
          false: '',
        },
      },
      defaultVariants: {
        variant: 'default',
        size: 'base',
        rounded: true,
        disabled: false,
      },
    },
  );

  const inputStyle = cva('bg-transparent cursor-inherit min-w-0', {
    variants: {
      disabled: {
        true: 'text-text/30',
        false: '',
      },
    },
  });

  type inputWrapperStyleType = VariantProps<typeof inputWrapperStyle>;

  // Props
  const modelValue = defineModel('modelValue', { type: String, required: true });
  const props = withDefaults(
    defineProps<{
      prefix?: string;
      prefixIcon?: FunctionalComponent;
      suffix?: string;
      suffixIcon?: FunctionalComponent;
      pattern?: string;

      clearable?: boolean;
      disabled?: boolean;

      inputClass?: string;
      variant?: inputWrapperStyleType['variant'];
      size?: inputWrapperStyleType['size'];
      rounded?: inputWrapperStyleType['rounded'];
    }>(),
    {},
  );

  // Properties
  const { clearable, disabled, prefix, prefixIcon, suffix, suffixIcon, pattern } = toRefs(props);
  const { prefix: prefixSlot, suffix: suffixSlot } = useSlots();
  const prefixExist = computed(() => prefixSlot || prefixIcon.value || prefix.value);
  const suffixExist = computed(() => suffixSlot || suffixIcon.value || suffix.value);

  const value = ref();

  const inputHandler = () => {
    if (!disabled.value) {
      const ret = valueFormat(value.value);
      value.value = ret;
      modelValue.value = ret;
    }
  };

  const clearHandler = () => {
    if (clearable.value) {
      modelValue.value = '';
    }
  };

  const valueFormat = (input: number | string) => {
    if (pattern.value && input) {
      const ret = input.toString().match(new RegExp(pattern.value));
      return ret?.[0] || '';
    } else {
      return input.toString();
    }
  };

  watch(
    () => modelValue.value,
    () => {
      value.value = valueFormat(modelValue.value);
    },
    { immediate: true },
  );
</script>

<style lang="less" scoped>
  .prefix,
  .suffix {
    @apply text-gray-500 rounded-md text-sm;
    @apply px-1 flex items-center gap-1;
  }

  .clear-icon {
    @apply text-gray hover:text-black transition-all;
    @apply cursor-pointer;
  }
</style>

