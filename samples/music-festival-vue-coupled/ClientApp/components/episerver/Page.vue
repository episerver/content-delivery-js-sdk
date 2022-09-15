<script setup>
const props = defineProps(["model"]);

const pageComponent = computed(() => {
  if (!props.model) {
    return null;
  }

  // Blocks are only loaded in edit mode, i.e. we should display them
  // with our preview component.
  if (props.model.contentType[0] === "Block") {
    return "BlockPreview";
  }

  // Pick the most specific component, i.e. first component that matches
  // the the content type name in the content type inheritance chain.
  for (let i = props.model.contentType.length - 1; i >= 0; i -= 1) {
    const resolved = resolveComponent(props.model.contentType[i]);
    if (typeof resolved === "object") {
      return resolved;
    }
  }

  return null;
});
</script>

<template>
  <component :is="pageComponent" :model="model" />
</template>
