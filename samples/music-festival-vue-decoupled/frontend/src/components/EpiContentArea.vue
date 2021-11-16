<!--
    Renders a ContentArea by iterating through all the blocks and using the
    `BlockComponentSelector` to render the corresponding Vue component.

    By setting the `data-epi-block-id` attribute the block becomes editable
    during On-Page Edit. It will not be set in View mode to not leak out too
    much info about Optimizely to visitors.

    The model property is provided by the page or block that owns the
    ContentArea.
-->

<template>
  <section class="Grid Grid--alignMiddle Grid--gutterA ContentArea">
      <div v-for="(block, index) in model"
           class="Grid-cell"
           :class="getDisplayOption(block.displayOption)"
           :data-epi-content-id="isEditable ? block.contentLink.guidValue : null"
           :key="index">
          <BlockComponentSelector :model="block.contentLink.expanded" />
      </div>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import BlockComponentSelector from '@/components/EpiBlockComponentSelector.vue';
import { DISPLAY_OPTIONS } from '@/constants';

export default {
  props: ['model'],
  computed: mapState({
    isEditable: (state) => state.epiContext.isEditable,
  }),
  components: {
    BlockComponentSelector,
  },
  methods: {
    getDisplayOption(value) {
      const keys = Object.keys(DISPLAY_OPTIONS);
      const values = Object.values(DISPLAY_OPTIONS);
      for (let i = 0; i < keys.length; i += 1) {
        if (value === keys[i]) {
          return values[i];
        }
      }
      return null;
    },
  },
};
</script>
