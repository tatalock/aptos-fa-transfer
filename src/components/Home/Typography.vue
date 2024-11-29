<template>
  <div class="text-size-[clamp(18px,1vw,40px)] py-10 flex-col-axis-center gap-8">
    <div :class="`${font}`" class="relative w-fit flex-col" v-for="font in fontList" :key="font">
      <span class="text-sm">{{ font }}</span>
      <span>{{ text }}</span>
    </div>
    <Plane />
  </div>
</template>

<script lang="ts" setup>
  import { Plane } from 'lucide-vue-next';

  const str = 'The quick brown fox jumps over the lazy dog';
  const text = `1234567890 ${str} == ==> <==`;
  const font = ['normal', 'medium', 'bold', 'black'];
  const fontFace = ['mono', 'sans'];

  const fontList = fontFace
    .map((face) => {
      return font.map((weight) => {
        return `font-${face} font-${weight}`;
      });
    })
    .flat();
</script>

<style lang="less" scoped></style>

