<!--
    Shown on the LandingPage, it renders editable texts on top of an image.
     - To edit the background image, there is an EpiProperty button.
     - OPE overlays are turned off when `modalShowing` is true (the LandingPage
       modal BuyTicketBlock). This is communicated to the `epiEdit` directive
       through the computed property `shouldRenderEditAttributes`.
-->

<template>
  <section class="Hero">
      <div class="Hero-content Page-container">
          <h1 v-epi-edit="'Title'" v-html="title"></h1>
          <h5 v-epi-edit="'Subtitle'" v-html="subtitle"></h5>
          <EpiProperty v-show="!epiDisableEditing" property-name="HeroImage" />
      </div>
      <div class="Hero-image" v-if="heroimage" :style="{ 'background-image': 'url(' + heroimage + ')' }"></div>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import EpiProperty from '@/components/EpiProperty.vue';

export default {
  props: ['title', 'subtitle', 'heroimage'],
  components: {
    EpiProperty,
  },
  computed: mapState({
    epiDisableEditing: (state) => state.appContext.modalShowing,
  }),
};
</script>
