// The v-epi-edit directive is responsible for adding the
// necessary attributes on-page-edit needs to render its overlay.

import { ContextMode } from '@episerver/content-delivery'

const { resolvedContent } = useResolvedContent();

function toggleEditAttributes(el, binding) {
  const isEditable = resolvedContent.mode === ContextMode.Edit;
  if (isEditable) {
    el.setAttribute('data-epi-property-name', binding.value);
    el.setAttribute('data-epi-property-render', 'none')
  } else {
    el.removeAttribute('data-epi-property-name');
    el.removeAttribute('data-epi-property-render')
  }
}

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.directive('epi-edit', {
    beforeMount(el, binding) {
      toggleEditAttributes(el, binding);
    },
    updated(el, binding) {
      toggleEditAttributes(el, binding);
    }
  })
})
