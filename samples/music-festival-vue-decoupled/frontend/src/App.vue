<template>
    <RouterView />
</template>

<script>
export default {
  mounted() {
    /*
     * If the `epieditmode` parameter is present we know we're
     * in either edit- or preview mode and should include following scripts.
     */
    if (this.$route.query.epieditmode || document.location.search.includes('epieditmode')) {
      const domainScript = document.createElement('script');
      domainScript.innerHTML = 'document.domain = \'localhost\';';
      document.body.appendChild(domainScript);

      const communicationScript = document.createElement('script');
      communicationScript.src = `${process.env.VUE_APP_CONTENT_DELIVERY_API}/episerver/cms/latest/clientresources/epi-cms/communicationinjector.js`;
      document.body.appendChild(communicationScript);
    }
  },
};
</script>
