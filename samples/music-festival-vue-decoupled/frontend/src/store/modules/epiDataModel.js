/*
 * The module that is responsible for handling the state of the current content
 * that is being either viewed or edited. This module will handle talking to
 * the API when the model needs to be updated when navigating or editing the
 * site.
 */

import contentLoader from '@/epiContentLoader';
import { UPDATE_CONTEXT } from './epiContext';

// Actions for the epiDataModel module
export const UPDATE_MODEL_BY_URL = 'epiDataModel/UPDATE_MODEL_BY_URL';
export const UPDATE_MODEL_BY_CONTENT_LINK = 'epiDataModel/UPDATE_MODEL_BY_CONTENT_LINK';

export const MODEL_STATUS = {
  UNKNOWN: 0,
  RESOLVED: 200,
  NOTFOUND: 404,
  UNAUTHORIZED: 401,
  ACCESSDENIED: 403,
};

const UPDATE_MODEL = 'epiDataModel/UPDATE_MODEL';

const parameters = {
  expand: '*',
};

function setContext(commit, response) {
  if (response.headers['x-epi-contextmode'] === 'Edit') {
    const context = {
      isEditable: true,
      inEditMode: true,
    };
    commit(UPDATE_CONTEXT, context);
  }
}

function translateHttpStatus(status) {
  switch (status) {
    case 200:
      return MODEL_STATUS.RESOLVED;
    case 401:
      return MODEL_STATUS.UNAUTHORIZED;
    case 403:
      return MODEL_STATUS.ACCESSDENIED;
    case 404:
      return MODEL_STATUS.NOTFOUND;
    default:
      return MODEL_STATUS.UNKNOWN;
  }
}

const state = {
  model: {},
  modelLoaded: false,
  status: MODEL_STATUS.UNKNOWN,
};

const mutations = {
  [UPDATE_MODEL](state, payload) {
    state.model = payload.model || {};
    state.modelLoaded = (payload.status === MODEL_STATUS.RESOLVED);
    state.status = payload.status;
  },
};

const actions = {
  /*
   * When updating a model by URL we assume that the URL
   * contains every querystring parameter that we might need on the server.
   */
  [UPDATE_MODEL_BY_URL]({ commit }, url) {
    return contentLoader.getContentByUrl(url, parameters).then((response) => {
      if (!response) {
        return;
      }

      setContext(commit, response);
      commit(UPDATE_MODEL, { model: response.data[0], status: translateHttpStatus(response.status) });
    }).catch((error) => commit(UPDATE_MODEL, { status: translateHttpStatus(error.response.status) }));
  },

  /*
   * Updating a model by content link is done when something is being
   * edited and when viewing a block. In order to be sure that we get the
   * correct model, we need to keep any previously existing query string
   * from the friendly URL.
   */
  [UPDATE_MODEL_BY_CONTENT_LINK]({ commit, rootState }, contentLink) {
    const params = {
      ...parameters,
      ...rootState.route.query,
    };

    return contentLoader.getContentByContentLink(contentLink, params).then((response) => {
      if (!response) {
        return;
      }

      setContext(commit, response);
      commit(UPDATE_MODEL, { model: response.data, status: translateHttpStatus(response.status) });
    }).catch((error) => commit(UPDATE_MODEL, { status: translateHttpStatus(error.response.status) }));
  },
};

export default {
  state,
  mutations,
  actions,
};
