<template>
  <Card class="leading-tight shadow-md shadow-md">{{ str.repeat(20) }}</Card>
  <Card class="leading-snug">{{ str.repeat(20) }}</Card>
  <Card title="Github" :content="str.repeat(10)" />
  <Card title="Github" content="content content">{{ str.repeat(10) }}</Card>
  <Card :content="str.repeat(20)">
    <template #title>
      <span>Github</span>
    </template>
  </Card>
  <Card class="text-lg-relaxed" title="What a wonderful world">
    <span class="mb-2">{{ str.repeat(20) }}</span>
    <template #bottom>
      <div class="flex-col gap-4 flex-wrap">
        <div class="flex gap-4 items-center flex-wrap">
          <Button size="xs">Button</Button>
          <Button size="sm">Button</Button>
          <Button>Button</Button>
          <Button size="lg">Button</Button>
        </div>
        <div class="flex gap-4 items-center flex-wrap">
          <Button outline size="sm">Button</Button>
          <Button outline secondary size="sm">Button</Button>
          <Button outline inverted size="sm">Button</Button>
        </div>
        <div class="flex gap-4 items-center flex-wrap">
          <Button outline info size="sm">Button</Button>
          <Button outline error size="sm">Button</Button>
          <Button outline success size="sm">Button</Button>
          <Button outline warning size="sm">Button</Button>
        </div>
        <div class="flex gap-4 items-center flex-wrap">
          <Button info size="sm">Button</Button>
          <Button error size="sm">Button</Button>
          <Button success size="sm">Button</Button>
          <Button warning size="sm">Button</Button>
        </div>
        <div class="flex gap-4 items-center flex-wrap">
          <Button disabled>Button</Button>
          <Button loading>Button</Button>
          <Button :prefixIcon="ArrowRight" :suffixIcon="ArrowLeft" :suffixIconSize="60">
            Button
          </Button>
          <Button rounded :prefixIcon="ArrowRight"></Button>
          <Button rounded>Go</Button>
          <Button rounded loading>Go</Button>
        </div>
      </div>
    </template>
  </Card>
  <Card class="text-xl-loose">{{ str.repeat(20) }}</Card>
  <Card class="leading-loose">{{ str.repeat(20) }}</Card>
</template>

<script lang="ts" setup>
  import { str } from '@/config';
  import Button from '@/lib/Button.vue';
  import Card from '@/lib/Card.vue';
  import { ArrowLeft, ArrowRight } from 'lucide-vue-next';
</script>

<style lang="less" scoped></style>

