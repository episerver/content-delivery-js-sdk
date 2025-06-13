/*
 * Sets up subscription to the `contentSaved` event that will update
 * the model in the store during editing.
 */

import store from "@/store";
import { parsePreviewToken } from "@/urlHelpers";
import { UPDATE_PREVIEW_TOKEN } from "@/store/modules/epiContext";
import { UPDATE_MODEL_BY_URL } from "@/store/modules/epiDataModel";

window.addEventListener("optimizely:cms:contentSaved", (event) => {
  var parsed = parsePreviewToken(event.detail.previewUrl);
  store.commit(UPDATE_PREVIEW_TOKEN, parsed.previewToken);
  store.dispatch(UPDATE_MODEL_BY_URL, parsed.url);
});
