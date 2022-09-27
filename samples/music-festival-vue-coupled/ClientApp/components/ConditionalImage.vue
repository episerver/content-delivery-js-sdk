<script setup>
defineProps(["alt", "src"]);
</script>

<template>
  <img class="ConditionalImage" v-if="src" :src="src" :alt="alt" />
</template>

