<template>
  <div>
    <RouterView />
  </div>
</template>

<script>
import { defaultConfig } from '@episerver/content-delivery';

export default {
  mounted() {
    defaultConfig.apiUrl = '/api/episerver/v3.0';
    defaultConfig.selectAllProperties = true;
    defaultConfig.expandAllProperties = true;

    /*
     * If the `epieditmode` parameter is present we know we're
     * in either edit- or preview mode and should include following script.
     */
    if (this.$route.query.epieditmode || document.location.search.includes('epieditmode')) {
      const communicationScript = document.createElement('script');
      communicationScript.src = '/episerver/cms/latest/clientresources/communicationinjector.js';
      document.body.appendChild(communicationScript);
    }
  },
};
</script>
