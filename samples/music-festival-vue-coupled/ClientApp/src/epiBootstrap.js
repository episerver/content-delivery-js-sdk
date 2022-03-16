/*
 * Context flags that are useful to enable properly working On-Page Editing.
 * Sets the context in the vuex store to be used on every component that is
 * interested.
 *
 * These values are `false` by default and will be updated when the page has
 * finished loading. See the event handler at the bottom of the page.
 *
 * Also registers the `contentSaved` event that will update
 * the model in the store during editing.
 */

import store from '@/store';
import { UPDATE_CONTEXT } from '@/store/modules/epiContext';
import { UPDATE_MODEL_BY_URL } from '@/store/modules/epiDataModel';

function setContext() {
  const context = {
    inEditMode: window.epi.inEditMode,
    isEditable: window.epi.isEditable,
  };

  // Make the context available to all Vue components.
  store.commit(UPDATE_CONTEXT, context);

  // If we're in an editable context we want to update the model on every change by the editor.
  if (window.epi.isEditable) {
    window.epi.subscribe('contentSaved', (message) => {
      const previewUrl = new URL(message.previewUrl);
      store.dispatch(UPDATE_MODEL_BY_URL, previewUrl.pathname + previewUrl.search + previewUrl.hash);
    });
  }
}

// function attachSubscriber() {
//   // Expect `epi` to be there after the `load` event. If it's not then we're
//   // not in any editing context or we have to wait for a while.
//   let attempt = 0;
//   const interval = setInterval(() => {
//     if (attempt >= 5) {
//       clearInterval(interval);
//     } else {
//       if (window.epi) {
//         attempt = 5;
//       } else {
//         attempt += 1;

//         console.error('Communication with On-Page Editing is not ready yet...');
//         console.error(`Attempt ${attempt}. Trying again in 1 second.`);

//         return;
//       }

//       if (window.epi.ready === true) {
//         // `epiReady` already fired.
//         setContext();
//       } else if (window.epi.subscribe) {
//         window.epi.subscribe('epiReady', () => setContext());
//       }
//     }
//   }, 2000);
// }

// window.addEventListener('load', () => attachSubscriber());

window.addEventListener('load', () => {
  // Expect `epi` to be there after the `load` event. If it's not then we're
  // not in any editing context.
  if (!window.epi) {
    return;
  }

  if (window.epi.ready === true) {
    setContext();
  } else if (window.epi.subscribe) {
    window.epi.subscribe('epiReady', () => setContext());
  }
});
