<script setup>
import { ContextMode } from '@episerver/content-delivery'

defineProps(["model"]);

const { resolvedContent } = useResolvedContent();
const { getDisplayOption } = useDisplayOptions();
</script>

<template>
  <section class="Grid Grid--alignMiddle Grid--gutterA ContentArea">
    <div
      class="Grid-cell"
      v-for="(block, index) in model"
      :key="index"
      :data-epi-content-id="resolvedContent.mode === ContextMode.Edit ? block.contentLink.guidValue : null"
      :class="getDisplayOption(block.displayOption)"
    >
      <EpiserverBlock :model="block.contentLink.expanded" />
    </div>
  </section>
</template>
