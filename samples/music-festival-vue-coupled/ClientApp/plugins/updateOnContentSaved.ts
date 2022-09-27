// This plugin sets up the communication between on-page-edit
// and our application. When content has changed, we need to
// update our state.

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.hook('page:finish', () => {
    if (process.server) {
      return;
    }

    const { updateContentByUrl } = useResolvedContent();

    window.addEventListener('message', async (event) => {
      if (event.data.id === 'contentSaved') {
        const previewUrl = new URL(event.data.data.previewUrl);
        await updateContentByUrl(previewUrl.pathname + previewUrl.search + previewUrl.hash);
      }
    }, false);
  })
})
