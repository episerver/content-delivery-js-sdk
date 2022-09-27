<script setup>
defineProps(["previousUrl"]);
</script>

<template>
  <div v-if="previousUrl" class="backButton">
    <EpiserverLink :url="previousUrl">
      <img src="~/assets/images/back.svg" width="64" height="64" alt="" />
    </EpiserverLink>
  </div>
</template>

<style lang="less" scoped>
.backButton {
  z-index: 10;
  height: 50px;
  width: 50px;
  margin-top: 7px;
}

@media (min-width: 768px) {
  .backButton {
    height: 64px;
    width: 64px;
    margin-top: 0;
  }
}
</style>
