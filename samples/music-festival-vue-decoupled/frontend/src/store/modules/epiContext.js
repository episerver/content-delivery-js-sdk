/*
 * The module responsible to handling Episerver specific state that is relevant
 * when editing content in edit mode.
 */

// Mutation for the epiContext module
export const UPDATE_CONTEXT = "epiContext/UPDATE_CONTEXT";
export const UPDATE_PREVIEW_TOKEN = "epiContext/UPDATE_PREVIEW_TOKEN";

const state = {
  inEditMode: false,
  isEditable: false,
  previewToken: undefined,
};

const mutations = {
  [UPDATE_CONTEXT](state, isEditable) {
    state.isEditable = isEditable;
    state.inEditMode = isEditable;
  },
  [UPDATE_PREVIEW_TOKEN](state, previewToken) {
    state.previewToken = previewToken;
  },
};

export default {
  state,
  mutations,
};
