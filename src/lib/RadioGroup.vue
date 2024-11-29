<template>
  <div class="flex items-center gap-4 flex-wrap">
    <div class="flex flex-wrap gap-2 items-center" v-for="(option, index) in options" :key="index">
      <RadioBox
        :active="option.value === value"
        :label="option.label"
        :value="option.value"
        @click="$emit('update:value', option.value)"
      ></RadioBox>
      <!-- TODO: popover -->
    </div>
  </div>
</template>

<script lang="ts" setup>
  import RadioBox from './RadioBox.vue';
  defineProps(['options', 'value']);
</script>

