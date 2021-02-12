/*
 * The module that is responsible for handling the state of the current content
 * that is being either viewed or edited. This module will handle talking to
 * the API when the model needs to be updated when navigating or editing the
 * site.
 */

import AuthService from '@/authService';
import { ContentResolver } from '@episerver/content-delivery';
import { UPDATE_CONTEXT } from './epiContext';

export const UPDATE_MODEL_BY_URL = 'epiDataModel/UPDATE_MODEL_BY_URL';

const UPDATE_MODEL = 'epiDataModel/UPDATE_MODEL';

const state = {
  model: {},
  modelLoaded: false,
  status: 0,
};

const mutations = {
  [UPDATE_MODEL](state, payload) {
    state.model = payload.model || {};
    state.modelLoaded = (payload.status === 1);
    state.status = payload.status;
  },
};

const actions = {
  async [UPDATE_MODEL_BY_URL]({ commit }, url) {
    const authService = new AuthService();
    const accessToken = await authService.getAccessToken();
    const contentResolver = new ContentResolver(`${process.env.VUE_APP_CONTENT_DELIVERY_API}/api/episerver/v2.0`, accessToken);

    return contentResolver.resolveContent(url, true).then((resolvedContent) => {
      commit(UPDATE_MODEL, { model: resolvedContent.content, status: resolvedContent.status });

      const context = {
        isEditable: resolvedContent.mode === 2,
        inEditMode: resolvedContent.mode === 2,
      };

      commit(UPDATE_CONTEXT, context);
    }).catch(() => commit(UPDATE_MODEL, { status: 0 }));
  },
};

export default {
  state,
  mutations,
  actions,
};
