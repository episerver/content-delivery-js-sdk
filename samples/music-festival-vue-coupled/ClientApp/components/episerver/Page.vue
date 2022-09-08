<script setup>
defineProps(["model"]);

function getPageComponent(page) {
  if (!page) {
    return null;
  }

  // Blocks are only loaded in edit mode, i.e. we should display them
  // with our preview component.
  if (page.contentType[0] === "Block") {
    return "BlockPreview";
  }

  // Pick the most specific component, i.e. first component that matches
  // the the content type name in the content type inheritance chain.
  for (let i = page.contentType.length - 1; i >= 0; i -= 1) {
    const resolved = resolveComponent(page.contentType[i]);
    if (typeof resolved === "object") {
      return resolved;
    }
  }

  return null;
}
</script>

<template>
  <component
    :is="getPageComponent(model)"
    :model="model"
  />
</template>
