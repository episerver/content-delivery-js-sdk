<!--
    Renders a block in the different display option sizes as an OPE preview.
    The block is selected with the `BlockComponentSelector` based on its name.
    Like `PageComponentSelector`, this page gets the model from the vuex
    store's `epiDataModel` module.
-->

<template>
    <div class="preview-wrapper">
        <section class="Grid Preview" v-if="modelLoaded">
            <div class="Grid-cell u-border">
                <h5>Full</h5>
            </div>
            <div class="Grid-cell u-md-sizeFull">
                <BlockComponentSelector :model="model" />
            </div>

            <div class="Grid-cell u-border">
                <h5>Wide</h5>
            </div>
            <div class="Grid-cell u-md-size2of3">
                <BlockComponentSelector :model="model" />
            </div>

            <div class="Grid-cell u-border">
                <h5>Half</h5>
            </div>
            <div class="Grid-cell u-md-size1of2">
                <BlockComponentSelector :model="model" />
            </div>

            <div class="Grid-cell u-border">
                <h5>Narrow</h5>
            </div>
            <div class="Grid-cell u-md-size1of3">
                <BlockComponentSelector :model="model" />
            </div>
        </section>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import BlockComponentSelector from '@/components/EpiBlockComponentSelector.vue';

export default {
  props: ['contentLink'],
  computed: mapState({
    model: (state) => state.epiDataModel.model,
    modelLoaded: (state) => state.epiDataModel.modelLoaded,
  }),
  components: {
    BlockComponentSelector,
  },
};
</script>

<style lang="less">
    @import '../assets/styles/common/variables.less';

    .preview-wrapper {
        margin: 1em;
    }
    .u-border {
        margin: 1em 0;
        border-bottom: 1px solid fade(@colorWhite, 50%);
    }
    .Grid {
        .ContentBlock {
            .Grid-cell>span {
                width: 100%;
            }
        }
    }
</style>
