<!--
    Will select a view component based on the content type name.

    Compared to the `PageComponentSelector`, this does not use the store to get
    the model. It must take the model as a prop as the store model can be either:
     - The block, when editing in Preview.vue
     - The page that the block belongs to, when rendered by ContentArea.vue
-->

<template>
  <component :is="getComponentForModel(model)" :model="model" />
</template>

<script>
import { resolveComponent } from 'vue';

export default {
  props: ['model'],
  methods: {
    getComponentForModel(model) {
      // Pick the most specific view, i.e. first view that matches
      // the the content type name in the content type inheritance chain.
      for (let i = (model.contentType.length - 1); i >= 0; i -= 1) {
        const resolved = resolveComponent(model.contentType[i]);
        if (typeof resolved === 'object') {
          return model.contentType[i];
        }
      }

      return 'GenericBlock';
    },
  },
};
</script>
