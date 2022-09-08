<script setup>
import { ContextMode } from "@episerver/content-delivery";

defineProps(["url", "className"]);

const { resolvedContent } = useResolvedContent();
const config = useRuntimeConfig();
const apiUrl = new URL(config.apiUrl);

function useNuxtLink() {
  // Do not use NuxtLink in edit mode.
  return resolvedContent.mode === ContextMode.Default;
}

function makeUrlRelative(url) {
  // Make URL relative to enable client-side routing.
  const temp = new URL(url);
  return temp.host === apiUrl.host
    ? temp.pathname + temp.searchParams + temp.hash
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
