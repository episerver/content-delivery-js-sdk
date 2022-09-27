<script setup>
defineProps(["name", "imageUrl"]);
</script>

<template>
  <div class="artistImage">
    <div>
      <ConditionalImage :src="imageUrl" :alt="name" />
    </div>
  </div>
</template>

<style lang="less" scoped>
.artistImage {
  padding-top: 80px;
}

img {
  width: 100%;
  height: auto;
  animation: fadein 2s;
}

@keyframes fadein {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
