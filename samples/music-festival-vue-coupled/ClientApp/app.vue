<script setup>
import { defaultConfig } from "@episerver/content-delivery";

const { ssrContext } = useNuxtApp();
const { apiUrl } = useRuntimeConfig();

defaultConfig.apiUrl = apiUrl;
defaultConfig.selectAllProperties = true;
defaultConfig.expandAllProperties = true;

defaultConfig.getHeaders = () => {
  if (process.server) {
    // Forward the cookie header when rendering server-side,
    // making these calls authenticated as well.
    const headers = ssrContext.req.headers;
    if (headers["cookie"]) {
      return { cookie : headers["cookie"] };
    }
  }
};

defaultConfig.getUrl = (url) => {
  if (process.client) {
    // Always use relative URL client-side.
    var tempUrl = new URL(url, "http://temp");
    return tempUrl.pathname + tempUrl.search;
  }

  return url;
};

useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - Music Festival` : "Music Festival";
  },
});
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtLoadingIndicator />
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
