/*
 * The module that is responsible for handling the state of the current content
 * that is being either viewed or edited. This module will handle talking to
 * the API when the model needs to be updated when navigating or editing the
 * site.
 */

import { ContentResolver, ResolvedContentStatus, ContextMode } from '@episerver/content-delivery';
import { UPDATE_CONTEXT } from './epiContext';

export const UPDATE_MODEL_BY_URL = 'epiDataModel/UPDATE_MODEL_BY_URL';

const UPDATE_MODEL = 'epiDataModel/UPDATE_MODEL';

const state = {
  model: {},
  modelLoaded: false,
  status: ResolvedContentStatus.Unknown,
};

const mutations = {
  [UPDATE_MODEL](state, payload) {
    state.model = payload.model || {};
    state.modelLoaded = (payload.status === ResolvedContentStatus.Resolved);
    state.status = payload.status;
  },
};

const actions = {
  async [UPDATE_MODEL_BY_URL]({ commit }, url) {
    const contentResolver = new ContentResolver();

    return contentResolver.resolveContent(url, true).then((resolvedContent) => {
      commit(UPDATE_MODEL, { model: resolvedContent.content, status: resolvedContent.status });

      const context = {
        isEditable: resolvedContent.mode === ContextMode.Edit,
        inEditMode: resolvedContent.mode === ContextMode.Edit,
      };

      commit(UPDATE_CONTEXT, context);
    }).catch(() => commit(UPDATE_MODEL, { status: ResolvedContentStatus.Unknown }));
  },
};

export default {
  state,
  mutations,
  actions,
};
