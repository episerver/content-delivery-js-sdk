<script setup>
defineProps(["model"]);
</script>

<template>
  <div class="Page-container GenericBlock">
    <div class="Grid Grid--alignMiddle Grid--gutterA">
      <div class="Grid-cell">
        <p>Could not load {{ model.name }} vue component.</p>
      </div>
    </div>
  </div>
</template>
