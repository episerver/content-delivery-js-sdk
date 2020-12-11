<!--
    Renders a ContentArea by iterating through all the blocks and using the
    `BlockComponentSelector` to render the corresponding Vue component.

    By setting the `data-epi-block-id` attribute the block becomes editable
    during On-Page Edit. It will not be set in View mode to not leak out too
    much info about Episerver to visitors.

    The model property is provided by the page or block that owns the
    ContentArea.
-->

<template>
  <section class="Grid Grid--alignMiddle Grid--gutterA ContentArea">
      <div :key="index" v-for="(block, index) in model"
           :class="getDisplayOption(block.displayOption)"
           class="Grid-cell">
          <BlockComponentSelector :data-epi-block-id="isEditable ? block.contentLink.id : null"
                                    :model="block.contentLink.expanded" />
      </div>
  </section>
</template>

<script>
import BlockComponentSelector from '@/components/EpiBlockComponentSelector.vue';
import { DISPLAY_OPTIONS } from '@/constants';
import { mapState } from 'vuex';

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
