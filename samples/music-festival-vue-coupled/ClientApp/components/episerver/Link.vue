<script setup>
import { ContextMode } from "@episerver/content-delivery";

defineProps(["url", "className"]);

const { resolvedContent } = useResolvedContent();
const { websiteUrl } = useRuntimeConfig();

const tempHostname = "http://temp";
const siteUrl = new URL(websiteUrl);

function useNuxtLink() {
  // Do not use NuxtLink in edit mode.
  return resolvedContent.mode === ContextMode.Default;
}

function makeUrlRelative(url) {
  // Make URL relative to enable client-side routing.
  const temp = new URL(url, tempHostname);

  if (temp.hostname === tempHostname) {
    // URL is already relative.
    return url;
  }

  // If URL is absolute, make it relative
  // when host is same as website.
  return temp.hostname === siteUrl.hostname
    ? temp.pathname + temp.search + temp.hash
    : url;
}
</script>

<template>
  <NuxtLink
    v-if="useNuxtLink()"
    class="EPiLink"
    :to="makeUrlRelative(url)"
    :class="className"
  >
    <slot></slot>
  </NuxtLink>
  <a v-else class="EPiLink" :href="makeUrlRelative(url)" :class="className">
    <slot></slot>
  </a>
</template>
