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
                <EpiBlockComponentSelector :model="model" />
            </div>

            <div class="Grid-cell u-border">
                <h5>Wide</h5>
            </div>
            <div class="Grid-cell u-md-size2of3">
                <EpiBlockComponentSelector :model="model" />
            </div>

            <div class="Grid-cell u-border">
                <h5>Half</h5>
            </div>
            <div class="Grid-cell u-md-size1of2">
                <EpiBlockComponentSelector :model="model" />
            </div>

            <div class="Grid-cell u-border">
                <h5>Narrow</h5>
            </div>
            <div class="Grid-cell u-md-size1of3">
                <EpiBlockComponentSelector :model="model" />
            </div>
        </section>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  props: ['contentLink'],
  computed: mapState({
    model: (state) => state.epiDataModel.model,
    modelLoaded: (state) => state.epiDataModel.modelLoaded,
  })
};
</script>
