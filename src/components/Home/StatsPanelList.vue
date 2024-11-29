<template>
  <div class="grid grid-cols-1 gap-1 w-full" md="grid-cols-3 gap-4">
    <StatsPanel title="APR" content="123123" />
    <StatsPanel title="APR" content="123123" vertical="center" />
    <StatsPanel title="APR" content="123123" vertical="right" />
  </div>
  <StatsPanelGroup>
    <StatsPanel title="APR" content="123123" />
    <StatsPanel title="APR" content="123123" vertical="center" />
    <StatsPanel title="APR" content="123123" vertical="right" />
  </StatsPanelGroup>

  <StatsPanelGroup>
    <StatsPanel title="APR" content="123123" />
    <StatsPanel title="APR" content="123123" />
    <StatsPanel title="APR" content="123123" />
  </StatsPanelGroup>
</template>

<script lang="ts" setup>
  import StatsPanel from '@/lib/StatsPanel.vue';
  import StatsPanelGroup from '@/lib/StatsPanelGroup.vue';
</script>

<style lang="less" scoped></style>

