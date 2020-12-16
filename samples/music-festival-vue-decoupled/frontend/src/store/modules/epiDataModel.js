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

const state = {
  model: {},
  modelLoaded: false,
};

const UPDATE_MODEL = 'epiDataModel/UPDATE_MODEL';
const mutations = {
  [UPDATE_MODEL](state, newModel) {
    state.model = newModel;
    state.modelLoaded = true;
  },
};

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

const actions = {
  /*
   * When updating a model by URL we assume that the URL
   * contains every querystring parameter that we might need on the server.
   */
  [UPDATE_MODEL_BY_URL]({ commit }, url) {
    return contentLoader.getContentByUrl(url, parameters).then((response) => {
      setContext(commit, response);
      commit(UPDATE_MODEL, response.data[0]);
    });
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
      setContext(commit, response);
      commit(UPDATE_MODEL, response.data);
    });
  },
};

export default {
  state,
  mutations,
  actions,
};
