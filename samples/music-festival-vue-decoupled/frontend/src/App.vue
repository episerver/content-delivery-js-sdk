<template>
  <RouterView />
</template>

<script>
import store from "@/store";
import { defaultConfig } from "@episerver/content-delivery";

export default {
  mounted() {
    defaultConfig.apiUrl = `${process.env.VUE_APP_CONTENT_DELIVERY_API}/api/episerver/v3.0`;
    defaultConfig.selectAllProperties = true;
    defaultConfig.expandAllProperties = true;
    defaultConfig.getHeaders = () => {
      if (store.state.epiContext.previewToken) {
        return {
          Authorization: `preview_token ${store.state.epiContext.previewToken}`,
        };
      }

      return {};
    };

    /*
     * If the `epieditmode` parameter is present we know we're
     * in either edit- or preview mode and should include following scripts.
     */
    if (this.$route.query.epieditmode || document.location.search.includes("epieditmode")) {
      const communicationScript = document.createElement("script");
      communicationScript.src = `${process.env.VUE_APP_CONTENT_DELIVERY_API}/episerver/cms/latest/clientresources/communicationinjector.js`;
      document.body.appendChild(communicationScript);
    }
  },
};
</script>
