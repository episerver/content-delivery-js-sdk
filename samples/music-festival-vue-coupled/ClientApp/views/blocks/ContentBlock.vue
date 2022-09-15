<script setup>
const props = defineProps(["model"]);

const imageAlignment = computed(() => {
  if (props.model.imageAlignment === "Right") {
    return "Grid--rowReverse";
  }
  return null;
});
</script>

<template>
  <div class="Page-container ContentBlock">
    <div class="Grid Grid--alignMiddle Grid--gutterA" :class="imageAlignment">
      <div class="Grid-cell u-md-size1of2" v-if="model.image">
        <ConditionalImage
          :src="model.image"
          :alt="model.title"
          v-epi-edit="'Image'"
        />
      </div>
      <div class="Grid-cell" :class="{ 'u-md-size1of2': model.image }">
        <h2 v-epi-edit="'Title'">{{ model.title }}</h2>
        <div v-epi-edit="'Content'" v-html="model.content"></div>
        <EpiserverProperty v-if="!model.image" property-name="image" />
      </div>
    </div>
  </div>
</template>
