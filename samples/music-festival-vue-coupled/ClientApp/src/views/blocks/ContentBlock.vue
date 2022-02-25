<!--
    Displays an optional image with a right or left alignment and
    some text. When there is no image selected, the right/left
    grid is not rendered, so to make OPE image selection possible
    we render a epi-property button.
-->

<template>
    <div class="Page-container ContentBlock">
        <div class="Grid Grid--alignMiddle Grid--gutterA"
             :class="imageAlignment(model.imageAlignment)">
            <div class="Grid-cell u-md-size1of2" v-if="model.image">
                <ConditionalImage :src="model.image"
                                  :alt="model.title"
                                  v-epi-edit="'Image'" />
            </div>
            <div class="Grid-cell" :class="{'u-md-size1of2': model.image}">
                <h2 v-epi-edit="'Title'">{{model.title}}</h2>
                <div v-epi-edit="'Content'" v-html="model.content"></div>
                <EpiProperty v-if="!model.image" property-name="image" />
            </div>
        </div>
    </div>
</template>

<script>
import ConditionalImage from '@/components/widgets/ConditionalImage.vue';
import EpiProperty from '@/components/EpiProperty.vue';

export default {
  props: ['model'],
  methods: {
    imageAlignment(direction) {
      if (direction === 'Right') {
        return 'Grid--rowReverse';
      }
      return null;
    },
  },
  components: {
    ConditionalImage,
    EpiProperty,
  },
};
</script>

<style lang="less" scoped>
    @import '../../assets/styles/common/variables.less';
</style>
