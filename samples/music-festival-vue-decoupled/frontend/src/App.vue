<template>
    <RouterView />
</template>

<script>
export default {
  mounted() {
    /*
     * Catch-22, we need to know when we're in edit mode,
     * but we only know that when we have already loaded the content.
     * I.e. we can't check the `epiContext` state.
     * This script need to be embedded before the content is loaded.
     * We could probably check document.parent.name === 'SitePreview',
     * but then we must set cross-origin policies on the iframe.
    */
    const domainScript = document.createElement('script');
    domainScript.innerHTML = 'document.domain = \'localhost\';';
    document.body.appendChild(domainScript);

    const communicationScript = document.createElement('script');
    communicationScript.src = `${process.env.VUE_APP_CONTENT_DELIVERY_API}/episerver/cms/latest/clientresources/epi-cms/communicationinjector.js`;
    document.body.appendChild(communicationScript);
  },
};
</script>
