<!--
    This should be used for links when they should be completely disabled when in
    an Optimizely CMS UI editing context. One example is language selection links,
    because language selection should be done in the CMS UI instead.
-->

<template>
  <EpiLink :url="url"
           :class="{ 'edit-mode': inEditMode }">
    <slot></slot>
  </EpiLink>
</template>

<script>
import { mapState } from 'vuex';
import EpiLink from '@/components/EpiLink.vue';

export default {
  props: ['url'],
  computed: mapState({
    inEditMode: (state) => state.epiContext.inEditMode,
  }),
  components: {
    EpiLink,
  },
};
</script>

<style lang="less" scoped>
    .edit-mode {
        pointer-events: none;
    }
</style>
