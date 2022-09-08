<script setup>
defineProps(["model"]);
</script>

<template>
  <div class="Page-container ImageFile">
    <div class="Grid Grid--alignMiddle Grid--gutterA">
      <div class="Grid-cell">
        <ConditionalImage :src="model.url" />
      </div>
    </div>
  </div>
</template>
