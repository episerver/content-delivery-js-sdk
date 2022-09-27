<script setup>
defineProps(["title", "subtitle", "heroimage"]);
const { active: modalActive } = useModal();
</script>

<template>
  <section class="Hero">
    <div class="Hero-content Page-container">
      <h1 v-epi-edit="'Title'" v-html="title"></h1>
      <h5 v-epi-edit="'Subtitle'" v-html="subtitle"></h5>
      <EpiserverProperty v-show="!modalActive" property-name="HeroImage" />
    </div>
    <div
      class="Hero-image"
      v-if="heroimage"
      :style="{ 'background-image': 'url(' + heroimage + ')' }"
    ></div>
  </section>
</template>
