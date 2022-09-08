<script setup>
defineProps(["model"]);

function getBlockComponent(block) {
  // Pick the most specific component, i.e. first component that matches
  // the the content type name in the content type inheritance chain.
  for (let i = block.contentType.length - 1; i >= 0; i -= 1) {
    const resolved = resolveComponent(block.contentType[i]);
    if (typeof resolved === "object") {
      return resolved;
    }
  }

  return "GenericBlock";
}
</script>

<template>
  <component
    :is="getBlockComponent(model)"
    :model="model"
  />
</template>
