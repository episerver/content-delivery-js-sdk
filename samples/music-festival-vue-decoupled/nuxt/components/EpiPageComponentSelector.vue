<!--
    Will select a view component based on the content type name.

    It gets its `model` from the vuex stores `epiDataModel` module that's
    automatically updated in OPE when data is edited (through the `contentSaved` event).
    The store also includes `modelLoaded` that's set to true when the model has
    been populated in the store. This flag toggles the rendering of the page with `v-if`.
-->

<template>
  <div v-if="modelLoaded">
      <component :is="getComponentForModel(model)" :model="model" />
  </div>
</template>

<script>
import '~/assets/styles/main.css'
// import { resolveComponent } from 'vue';
import { mapState } from 'vuex';
import { defaultConfig } from '@episerver/content-delivery';
// import authService from '~/authService';


export default {
  async asyncData ({
    store,
    route
  }) {
    defaultConfig.apiUrl = `http://localhost:8081/api/episerver/v3.0`;
    // defaultConfig.getAccessToken = () => authService.getAccessToken();
    defaultConfig.selectAllProperties = true;
    defaultConfig.expandAllProperties = true;

    await store.dispatch('epiDataModel/UPDATE_MODEL_BY_URL', route.fullPath);
    console.log(store.state);
  },
  computed: mapState({
    model: (state) => state.epiDataModel.model,
    modelLoaded: (state) => state.epiDataModel.modelLoaded,
  }),
  methods: {
    getComponentForModel(model) {
      if (!model) {
        return null;
      }

      // Blocks are only loaded in edit mode, i.e.
      // we should display them in our preview component.
      if (model.contentType[0] === 'Block') {
        return 'BlockPreview';
      }

      // Pick the most specific view component, i.e. first view that matches
      // the the content type name in the content type inheritance chain.
      for (let i = (model.contentType.length - 1); i >= 0; i -= 1) {
        return model.contentType[i];
      }

      return null;
    },
  },
  mounted() {
    console.log("asdasd");
  }
};
</script>
