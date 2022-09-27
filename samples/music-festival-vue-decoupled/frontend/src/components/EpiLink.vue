<!--
    This should be used for links instead of regular anchor elements. It will
    detect if the view is in an Episerver CMS UI editing context, and then
    disable Vue router. That's needed to get context changes to work, such as
    updating the page navigation tree.
-->

<template >
  <router-link v-if="userRouterLink" class="EPiLink" :to="clientUrl" :class="className">
    <slot></slot>
  </router-link>
  <a v-else class="EPiLink" :href="clientUrl" :class="className">
    <slot></slot>
  </a>
</template>

<script>
import { mapState } from 'vuex';

export default {
  props: [
    'url',
    'className',
  ],
  computed: mapState({
    userRouterLink(state) {
      // Define whether we should use the tag 'a' or 'router-link' when generating a link.
      // The reason is because <router-link> doesn't support absolute link
      // (https://github.com/vuejs/vue-router/issues/1131), which happens when we link to a page
      // in another site in a multi-sites system.
      // There is an open feature-request for making 'router-link' support absolute links.
      // https://github.com/vuejs/vue-router/issues/1280

      // Never use 'router-link' in edit mode to update the Optimizely UI
      if (state.epiContext.inEditMode) {
        return false;
      }

      try {
        const url = new URL(this.url);
        return url.host === document.location.host;
      } catch {
        return true;
      }
    },
    clientUrl() {
      try {
        // Make URL relative if host is matching, so client-side routing works.
        const url = new URL(this.url);
        return (url.host === document.location.host)
          ? url.pathname + url.search + url.hash
          : url;
      } catch {
        return this.url;
      }
    },
  }),
};
</script>
