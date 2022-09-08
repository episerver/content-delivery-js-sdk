<script setup>
import {
  ContextMode,
  ResolvedContentStatus,
} from "@episerver/content-delivery";

const { resolvedContent, updateContentByUrl, pending } = useResolvedContent();
const route = useRoute();

await updateContentByUrl(route.fullPath);

switch (resolvedContent.status) {
  case ResolvedContentStatus.NotFound:
    await navigateTo("/notfound", { replace: true });
    break;
  case ResolvedContentStatus.AccessDenied:
    await navigateTo("/accessdenied", { replace: true });
    break;
  case ResolvedContentStatus.Unauthorized:
    await navigateTo(`/util/login?ReturnUrl=${route.fullPath}`);
    break;
  default:
}

useHead({
  title: resolvedContent.content.name,
  script: resolvedContent.mode == ContextMode.Edit
      ? [
          {
            src: "/episerver/cms/latest/clientresources/communicationinjector.js",
            body: true,
          },
        ]
      : null,
});
</script>

<template>
  <EpiserverPage :model="resolvedContent.content" />
</template>
