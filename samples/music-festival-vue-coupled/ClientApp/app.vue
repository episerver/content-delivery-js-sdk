<script setup>
import { defaultConfig } from "@episerver/content-delivery";

defaultConfig.apiUrl = useRuntimeConfig().apiUrl;
defaultConfig.selectAllProperties = true;
defaultConfig.expandAllProperties = true;
defaultConfig.getHeaders = () => {
  if (process.server) {
    // Forward the cookie header when rendering server-side, so
    // those call are authenticated as well.
    const includeHeaders = ["cookie"];
    const headers = useNuxtApp().ssrContext.req.headers;
    return Object.fromEntries(
      includeHeaders
        .filter((key) => headers[key])
        .map((key) => [key, headers[key]])
    );
  }
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
