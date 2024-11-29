<template>
  <div class="flex-col gap-2 p-2">
    <Input v-model:modelValue="inputStr" input-class="font-semibold" />
    <Input prefix="Email" v-model:modelValue="inputStr" input-class="font-semibold" />
    <Input :prefixIcon="Mail" v-model:modelValue="inputStr" input-class="font-semibold" />
    <Input suffix="@gmail.com" v-model:modelValue="inputStr" input-class="font-semibold" />
    <Input :suffixIcon="Mail" v-model:modelValue="inputStr" input-class="font-semibold" clearable />
    <Input v-model:modelValue="inputStr" input-class="font-semibold">
      <template #prefix>
        <span class="text-green font-semibold">Prefix</span>
      </template>
    </Input>
    <Input v-model:modelValue="inputStr" input-class="font-semibold" clearable>
      <template #suffix>
        <span class="text-red font-semibold">Suffix</span>
      </template>
    </Input>
    <span>Disabled:</span>
    <Input
      placeholder="Disabled"
      :modelValue="'Disabled-www.google.com'"
      input-class="font-semibold"
      :disabled="true"
    />
    <hr />
    <span>Web3 Number Input:</span>
    <Input
      variant="empty"
      placeholder="0.00"
      :pattern="PATTERN.number(2)"
      v-model:modelValue="inputStr"
      clearable
    />
    <Input
      variant="empty"
      placeholder="Integer"
      :pattern="PATTERN.number(0)"
      v-model:modelValue="inputStr"
      clearable
    />
    <span>Filled</span>
    <Input
      placeholder="0.00"
      :pattern="PATTERN.number(2)"
      v-model:modelValue="inputStr"
      clearable
    />
    <span>Outline</span>
    <Input
      variant="outline"
      placeholder="0.00"
      :pattern="PATTERN.number(2)"
      v-model:modelValue="inputStr"
      clearable
    />
    <Input
      variant="outline-filled"
      placeholder="0.00"
      :pattern="PATTERN.number(2)"
      v-model:modelValue="inputStr"
      clearable
    />
  </div>
</template>

<script lang="ts" setup>
  import Input, { PATTERN } from '@/lib/Input.vue';
  import { Mail } from 'lucide-vue-next';

  const inputStr = ref('');
</script>

<style lang="less" scoped></style>

