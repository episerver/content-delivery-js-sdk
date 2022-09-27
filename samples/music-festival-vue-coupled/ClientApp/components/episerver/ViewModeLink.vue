<script setup>
import { ContextMode } from "@episerver/content-delivery";

defineProps(["url"]);

const { resolvedContent } = useResolvedContent();
</script>

<template>
  <EpiserverLink
    :url="url"
    :class="{ 'edit-mode': resolvedContent.mode === ContextMode.Edit }"
  >
    <slot></slot>
  </EpiserverLink>
</template>

<style lang="less" scoped>
.edit-mode {
  pointer-events: none;
}
</style>
