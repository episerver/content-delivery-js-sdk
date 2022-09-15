<script setup>
const props = defineProps(["model"]);

const blockComponent = computed(() => {
  // Pick the most specific component, i.e. first component that matches
  // the the content type name in the content type inheritance chain.
  for (let i = props.model.contentType.length - 1; i >= 0; i -= 1) {
    const resolved = resolveComponent(props.model.contentType[i]);
    if (typeof resolved === "object") {
      return resolved;
    }
  }

  return "GenericBlock";
});
</script>

<template>
  <component :is="blockComponent" :model="model" />
</template>
