<script setup>
import { ContextMode } from "@episerver/content-delivery";

defineProps(["propertyName"]);

const { resolvedContent } = useResolvedContent();
</script>

<template>
  <button
    v-if="resolvedContent.mode === ContextMode.Edit"
    v-epi-edit="propertyName"
    type="button"
  >
    Edit property: {{ propertyName }}
  </button>
</template>

<style lang="less" scoped>
button {
  background: gray;
  color: white;
}
</style>
