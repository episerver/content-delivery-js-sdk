<template>
  <div>
    <RouterView />
  </div>
</template>

<style lang="less" scoped>
  .LoginBar {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    z-index: 99;
    align-items: center;
  }

    .LoginBar .btn {
      position: absolute;
      top: 30px;
      right: 180px;
    }
</style>

<script>
import { defaultConfig } from '@episerver/content-delivery';

export default {
  mounted() {
    defaultConfig.apiUrl = '/api/episerver/v3.0';
    defaultConfig.selectAllProperties = true;
    defaultConfig.expandAllProperties = true;

    /*
      * If the `epieditmode` parameter is present we know we're
      * in either edit- or preview mode and should include following scripts.
      */
    if (this.$route.query.epieditmode || document.location.search.includes('epieditmode')) {
      const communicationScript = document.createElement('script');
      communicationScript.src = '/episerver/cms/latest/clientresources/communicationinjector.js';
      document.body.appendChild(communicationScript);
    }
  },
};
</script>
