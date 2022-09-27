<script setup>
import { ContextMode } from "@episerver/content-delivery";

const props = defineProps(["url", "className"]);

const { resolvedContent } = useResolvedContent();
const { websiteUrl } = useRuntimeConfig();

const tempHostname = "http://temp";
const siteUrl = new URL(websiteUrl);

const useNuxtLink = computed(() => {
  // Do not use NuxtLink in edit mode. We need
  // to do server-side rendering to update the context
  // to keep the page tree in sync.
  return resolvedContent.mode === ContextMode.Default;
});

const relativeUrl = computed(() => {
  // Make URL relative to enable client-side routing.
  const temp = new URL(props.url, tempHostname);

  if (temp.hostname === tempHostname) {
    // URL is already relative.
    return props.url;
  }

  // If URL is absolute, make it relative
  // when host is same as website.
  return temp.hostname === siteUrl.hostname
    ? temp.pathname + temp.search + temp.hash
    : props.url;
});
</script>

<template>
  <NuxtLink
    v-if="useNuxtLink"
    :to="relativeUrl"
    :class="className"
    class="EPiLink"
  >
    <slot></slot>
  </NuxtLink>
  <a v-else :href="relativeUrl" :class="className" class="EPiLink">
    <slot></slot>
  </a>
</template>
