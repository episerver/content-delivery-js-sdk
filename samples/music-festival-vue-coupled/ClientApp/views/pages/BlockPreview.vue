<script setup>
defineProps(["model"]);
const { resolvedContent } = useResolvedContent();
</script>

<template>
  <div class="preview-wrapper">
    <section class="Grid Preview">
      <div class="Grid-cell u-border">
        <h5>Full</h5>
      </div>
      <div class="Grid-cell u-md-sizeFull">
        <EpiserverBlock :model="resolvedContent.content" />
      </div>

      <div class="Grid-cell u-border">
        <h5>Wide</h5>
      </div>
      <div class="Grid-cell u-md-size2of3">
        <EpiserverBlock :model="resolvedContent.content" />
      </div>

      <div class="Grid-cell u-border">
        <h5>Half</h5>
      </div>
      <div class="Grid-cell u-md-size1of2">
        <EpiserverBlock :model="resolvedContent.content" />
      </div>

      <div class="Grid-cell u-border">
        <h5>Narrow</h5>
      </div>
      <div class="Grid-cell u-md-size1of3">
        <EpiserverBlock :model="resolvedContent.content" />
      </div>
    </section>
  </div>
</template>

<style lang="less">
@import "../../assets/styles/common/variables.less";

.preview-wrapper {
  margin: 1em;
}
.u-border {
  margin: 1em 0;
  border-bottom: 1px solid fade(@colorWhite, 50%);
}
.Grid {
  .ContentBlock {
    .Grid-cell > span {
      width: 100%;
    }
  }
}
</style>
